// detector.ts — CLEAN & ACCURATE (Only Phone + No Face)
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
    onStatusUpdate: (type: "phone" | "no_face" | "face_present" | "looking_down", bbox?: [number, number, number, number]) => void
) {
    if (!model) return

    const predictions = await model.detect(video)

    let phoneDetected = false
    let personDetected = false
    let phoneBbox: [number, number, number, number] | undefined
    let personBbox: [number, number, number, number] | undefined

    predictions.forEach((p) => {
        // PHONE: threshold 0.20 — catches phones reliably
        if ((p.class === "cell phone" || p.class === "remote") && p.score > 0.20) {
            phoneDetected = true
            phoneBbox = p.bbox as [number, number, number, number]
        }

        // PERSON
        if (p.class === "person" && p.score > 0.4) {
            personDetected = true
            personBbox = p.bbox as [number, number, number, number]
            lastSeenPerson = Date.now()
        }
    })

    const now = Date.now()

    // 1. PHONE DETECTED — instant, no frame delay
    if (phoneDetected) {
        onStatusUpdate("phone", phoneBbox)
        return
    }

    // 2. NO FACE — 5 second grace
    if (!personDetected && now - lastSeenPerson > 5000) {
        onStatusUpdate("no_face")
        return
    }

    // 3. ALL GOOD
    if (personDetected) {
        onStatusUpdate("face_present", personBbox)
    }
}