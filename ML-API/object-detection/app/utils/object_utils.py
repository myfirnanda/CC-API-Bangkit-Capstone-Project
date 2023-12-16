import cv2
import numpy as np
import tensorflow as tf


class LetterBox:
    """Resize image and padding for detection, instance segmentation, pose."""

    def __init__(self, new_shape=(640, 640), auto=False, scaleFill=False, scaleup=True, stride=32):
        """Initialize LetterBox object with specific parameters."""
        self.new_shape = new_shape
        self.auto = auto
        self.scaleFill = scaleFill
        self.scaleup = scaleup
        self.stride = stride

    def __call__(self, labels=None, image=None):
        """Return updated labels and image with added border."""
        if labels is None:
            labels = {}
        img = labels.get('img') if image is None else image
        shape = img.shape[:2]  # current shape [height, width]
        new_shape = labels.pop('rect_shape', self.new_shape)
        if isinstance(new_shape, int):
            new_shape = (new_shape, new_shape)

        # Scale ratio (new / old)
        r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
        if not self.scaleup:  # only scale down, do not scale up (for better val mAP)
            r = min(r, 1.0)

        # Compute padding
        ratio = r, r  # width, height ratios
        new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
        dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]  # wh padding
        if self.auto:  # minimum rectangle
            dw, dh = np.mod(dw, self.stride), np.mod(dh, self.stride)  # wh padding
        elif self.scaleFill:  # stretch
            dw, dh = 0.0, 0.0
            new_unpad = (new_shape[1], new_shape[0])
            ratio = new_shape[1] / shape[1], new_shape[0] / shape[0]  # width, height ratios

        dw /= 2  # divide padding into 2 sides
        dh /= 2
        if labels.get('ratio_pad'):
            labels['ratio_pad'] = (labels['ratio_pad'], (dw, dh))  # for evaluation

        if shape[::-1] != new_unpad:  # resize
            img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
        top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
        left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
        img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT,
                                 value=(114, 114, 114))  # add border

        if len(labels):
            labels = self._update_labels(labels, ratio, dw, dh)
            labels['img'] = img
            labels['resized_shape'] = new_shape
            return labels
        else:
            return img
        
        
def xywh2xyxy(x):
    """
    Convert bounding box coordinates from (x, y, width, height) format to (x1, y1, x2, y2) format where (x1, y1) is the
    top-left corner and (x2, y2) is the bottom-right corner.

    Args:
        x (np.ndarray | torch.Tensor): The input bounding box coordinates in (x, y, width, height) format.
    Returns:
        y (np.ndarray | torch.Tensor): The bounding box coordinates in (x1, y1, x2, y2) format.
    """
    y = np.copy(x)
    y[..., 0] = x[..., 0] - x[..., 2] / 2  # top left x
    y[..., 1] = x[..., 1] - x[..., 3] / 2  # top left y
    y[..., 2] = x[..., 0] + x[..., 2] / 2  # bottom right x
    y[..., 3] = x[..., 1] + x[..., 3] / 2  # bottom right y
    return y


def scale_boxes(img1_shape, boxes, img0_shape, ratio_pad=None):
    """
    Rescales bounding boxes (in the format of xyxy) from the shape of the image they were originally specified in
    (img1_shape) to the shape of a different image (img0_shape).

    Args:
      img1_shape (tuple): The shape of the image that the bounding boxes are for, in the format of (height, width).
      boxes (torch.Tensor): the bounding boxes of the objects in the image, in the format of (x1, y1, x2, y2)
      img0_shape (tuple): the shape of the target image, in the format of (height, width).
      ratio_pad (tuple): a tuple of (ratio, pad) for scaling the boxes. If not provided, the ratio and pad will be
                         calculated based on the size difference between the two images.

    Returns:
      boxes (torch.Tensor): The scaled bounding boxes, in the format of (x1, y1, x2, y2)
    """
    if ratio_pad is None:  # calculate from img0_shape
        gain = min(img1_shape[0] / img0_shape[0], img1_shape[1] / img0_shape[1])  # gain  = old / new
        pad = round((img1_shape[1] - img0_shape[1] * gain) / 2 - 0.1), round(
            (img1_shape[0] - img0_shape[0] * gain) / 2 - 0.1)  # wh padding
    else:
        gain = ratio_pad[0][0]
        pad = ratio_pad[1]

    boxes[..., [0, 2]] -= pad[0]  # x padding
    boxes[..., [1, 3]] -= pad[1]  # y padding
    boxes[..., :4] /= gain
    return boxes

def process_image(bgr_image, img_size=640):
    # Resize and pad image while maintaining aspect ratio
    im = [LetterBox(img_size, auto=False, stride=16)(image=bgr_image)]
    im = np.stack(im)
    im = im[..., ::-1].transpose((0, 1, 2, 3))  # BGR to RGB, BHWC to BCHW, (n, 3, h, w)
    im = np.ascontiguousarray(im)  # contiguous
    im = im.astype(np.float32)
    im /= 255

    return im

def model_inference(model, image):
    input_details = model.interpreter.get_input_details()
    model.interpreter.set_tensor(input_details[0]['index'], image)
    model.interpreter.invoke()

    output_details = model.interpreter.get_output_details()
    output_data = model.interpreter.get_tensor(output_details[0]['index'])

    return output_data


def post_process(output_data, nc=0, 
                 conf_thres=0.01, iou_thres=0.5, 
                 max_det=300, max_nms=30000,
                 agnostic=False, max_wh=7680
                 ):
    
    bs = output_data.shape[0]
    nc = nc or (output_data.shape[1] - 4)
    nm = output_data.shape[1] - nc - 4
    mi = 4 + nc
    xc = np.amax(output_data[:, 4:mi], 1) > conf_thres

    multi_label = False
    multi_label &= nc > 1

    prediction = np.transpose(output_data, (0, -1, -2))
    prediction[..., :4] = xywh2xyxy(prediction[..., :4])
    output = [np.zeros((0, 6 + nm))] * bs

    for xi, x in enumerate(prediction):
        x = x[xc[xi]]

        if not x.shape[0]:
            continue

        box = x[:, :4]
        cls = x[:, 4:4 + nc]
        mask = x[:, 4 + nc:4 + nc + nm]

        conf = np.max(cls, axis=1, keepdims=True)
        j = np.argmax(cls, axis=1, keepdims=True)

        x = np.concatenate((box, conf, j.astype(float), mask), axis=1)

        conf_flat = conf.flatten()
        filtered_x = x[conf_flat > conf_thres]

        n = filtered_x.shape[0]

        if not n:
            continue
        if n > max_nms:
            sorted_indices = np.argsort(x[:, 4])[::-1]
            x = x[sorted_indices[:max_nms]]

        c = x[:, 5:6] * (0 if agnostic else max_wh)
        boxes, scores = x[:, :4] + c, x[:, 4]
        i = cv2.dnn.NMSBoxes(boxes, scores, score_threshold=0.01, nms_threshold=iou_thres)
        i = i[:max_det]
        output[xi] = x[i]

    results = []
    class_names = [
        "Egg", "Tomato", "Zucchini", "Almond", "Apple", "Banana", "Broccoli",
        "Butter", "Cabbage", "Carrot", "Cauliflower", "Cheese", "Cherry",
        "Chili", "Coconut", "Cucumber", "Dark-Chocolate", "Eggplant", "Grape",
        "Kiwi", "Mango", "Melon", "Orange", "Pear", "Pineapple", "Pomegranate",
        "Potato", "Strawberry", "Wallnut", "Watermelon", "White-Chocolate"
    ]  
    
    for result in output:
        for detection in result:
            _, _, _, _, conf, class_id = detection
            class_name = class_names[int(class_id)]
            results.append({"class_name": class_name, "confidence": conf})

    return results


class TFModel:
    def __init__(self):
        self.interpreter = tf.lite.Interpreter("app/ml/YOLO_V8s.tflite")
        self.interpreter.allocate_tensors()