const video = document.getElementById('video');
const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    let maskimg = new Image();
    maskimg.src = "http://localhost:3000/images/iron_mask.png"

    let handimg = new Image();
    handimg.src = "http://localhost:3000/images/iron_hand.png"

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
        });

    posenet.load().then(model => {
        video.onloadeddata = (e) => {
            predict();
        }
        function predict() {
            model.estimateSinglePose(video).then(pose => {
                canvas.width = video.width;
                canvas.height = video.height;
                drawKeypoints(pose.keypoints, 0.6, context);
                drawSkeleton(pose.keypoints, 0.6, context);
                for (let i = 0; i < pose.keypoints.length; i++) {
                    if (pose.keypoints[i].part === "rightEar")
                        context.drawImage(maskimg, pose.keypoints[i].position.x - 20, pose.keypoints[i].position.y - (maskimg.width / 2 + 30));
                    else if (pose.keypoints[i].part === "rightWrist")
                        context.drawImage(handimg, pose.keypoints[i].position.x - handimg.width / 2, pose.keypoints[i].position.y - handimg.height / 2);
                    else if (pose.keypoints[i].part === "leftWrist")
                        context.drawImage(handimg, pose.keypoints[i].position.x - handimg.width / 2, pose.keypoints[i].position.y - handimg.height / 2);

                }

            });
            requestAnimationFrame(predict);
        }
    })

    const color = 'aqua';
    const boundingBoxColor = 'red';
    const lineWidth = 2;

    function toTuple({ y, x }) {
        return [y, x];
    }

    function drawPoint(ctx, y, x, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    /**
     * Draws a line on a canvas, i.e. a joint
     */
    function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
        ctx.beginPath();
        ctx.moveTo(ax * scale, ay * scale);
        ctx.lineTo(bx * scale, by * scale);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    /**
     * Draws a pose skeleton by looking up all adjacent keypoints/joints
     */
    function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
        const adjacentKeyPoints =
            posenet.getAdjacentKeyPoints(keypoints, minConfidence);

        adjacentKeyPoints.forEach((keypoints) => {
            drawSegment(
                toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
                scale, ctx);
        });
    }

    /**
     * Draw pose keypoints onto a canvas
     */
    function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if (keypoint.score < minConfidence) {
                continue;
            }

            const { y, x } = keypoint.position;
            drawPoint(ctx, y * scale, x * scale, 3, color);
        }
    }

    /**
     * Draw the bounding box of a pose. For example, for a whole person standing
     * in an image, the bounding box will begin at the nose and extend to one of
     * ankles
     */
    function drawBoundingBox(keypoints, ctx) {
        const boundingBox = posenet.getBoundingBox(keypoints);

        ctx.rect(
            boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
            boundingBox.maxY - boundingBox.minY);

        ctx.strokeStyle = boundingBoxColor;
        ctx.stroke();
    }