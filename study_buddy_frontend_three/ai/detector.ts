// detector.ts
import * as cocoSsd from "@tensorflow-models/coco-ssd"
import "@tensorflow/tfjs"

let model: cocoSsd.ObjectDetection | null = null
let lastSeenPerson = Date.now()
let gazeDownStartTime: number | null = null

export async function loadModel() {
    model = await cocoSsd.load()
    console.log("AI Model Loaded")
}

export async function detectFrame(
    video: HTMLVideoElement,
    // Note the added "looking_down" type
    onStatusUpdate: (type: "phone" | "no_face" | "face_present" | "looking_down", bbox?: [number, number, number, number]) => void
) {
    if (!model) return

    const predictions = await model.detect(video)

    let phoneDetected = false
    let personDetected = false
    let phoneBbox: [number, number, number, number] | undefined
    let personBbox: [number, number, number, number] | undefined

    predictions.forEach((p) => {
        // EXTREMELY AGGRESSIVE DEMO THRESHOLD (0.15)
        // Forces the AI to trigger even if only a tiny fraction of the phone is visible behind the hand/ear!
        if ((p.class === "cell phone" || p.class === "remote") && p.score > 0.15) {
            phoneDetected = true
            phoneBbox = p.bbox as [number, number, number, number]
        }

        // Standard person detection
        if (p.class === "person" && p.score > 0.4) {
            personDetected = true
            personBbox = p.bbox as [number, number, number, number]
            lastSeenPerson = Date.now()
        }
    })

    // --- PRO-LEVEL LOOKING DOWN HEURISTIC ---
    let isLookingDown = false;
    if (personDetected && personBbox) {
        const [x, y, w, h] = personBbox;

        // In your screenshot, when staring down deeply, the top of your bounding box (y) 
        // drops below 22% of the video height. 
        if (y > video.videoHeight * 0.22) {
            isLookingDown = true;
        }
    }

    const now = Date.now()

    // 1. PHONE CHECK (Instant Execution - Super Strict)
    if (phoneDetected) {
        onStatusUpdate("phone", phoneBbox)
        return
    }

    // 2. HEAD TILT CONTINUOUS CHECK 
    // Uses a generous 3.5 SECOND delay so brief "studying/writing" doesn't trigger it!
    if (isLookingDown) {
        if (!gazeDownStartTime) gazeDownStartTime = now;
        else if (now - gazeDownStartTime > 3500) {
            onStatusUpdate("looking_down", personBbox);
            return;
        }
    } else {
        gazeDownStartTime = null;
    }

    // 3. PERSON MISSING CHECK (Grace Period: 5 seconds missing)
    if (!personDetected && now - lastSeenPerson > 5000) {
        onStatusUpdate("no_face")
        return
    }

    // 4. ALL GOOD - FACE PRESENT (Student is studying/visible properly)
    if (personDetected) {
        onStatusUpdate("face_present", personBbox)
    }
}