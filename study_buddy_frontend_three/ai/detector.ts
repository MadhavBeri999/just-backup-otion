// detector.ts
import * as cocoSsd from "@tensorflow-models/coco-ssd"
import "@tensorflow/tfjs"

let model: cocoSsd.ObjectDetection | null = null
let lastSeenPerson = Date.now()

export async function loadModel() {
    model = await cocoSsd.load()
    console.log("AI Model Loaded")
}

export async function detectFrame(
    video: HTMLVideoElement,
    // Callback now passes the event AND the bounding box array [x, y, width, height]
    onStatusUpdate: (type: "phone" | "no_face" | "face_present", bbox?: [number, number, number, number]) => void
) {
    if (!model) return

    const predictions = await model.detect(video)

    let phoneDetected = false
    let personDetected = false
    let phoneBbox: [number, number, number, number] | undefined
    let personBbox: [number, number, number, number] | undefined

    predictions.forEach((p) => {
        // High confidence threshold for phones
        if (p.class === "cell phone" && p.score > 0.5) {
            phoneDetected = true
            phoneBbox = p.bbox as [number, number, number, number]
        }

        // High confidence threshold for faces/persons
        if (p.class === "person" && p.score > 0.5) {
            personDetected = true
            personBbox = p.bbox as [number, number, number, number]
            lastSeenPerson = Date.now()
        }
    })

    // 1. PHONE CHECK (Instant)
    if (phoneDetected) {
        onStatusUpdate("phone", phoneBbox)
        return
    }

    // 2. PERSON MISSING CHECK (Grace Period: 5 seconds missing)
    const now = Date.now()
    if (!personDetected && now - lastSeenPerson > 5000) {
        onStatusUpdate("no_face")
        return
    }

    // 3. ALL GOOD - FACE PRESENT
    if (personDetected) {
        onStatusUpdate("face_present", personBbox)
    }
}
