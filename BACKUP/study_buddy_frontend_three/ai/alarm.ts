let alarmAudio: HTMLAudioElement | null = null

export function playAlarm() {
    if (!alarmAudio) {
        alarmAudio = new Audio("/alarm.mp3")
        alarmAudio.loop = false
    }

    alarmAudio.currentTime = 0
    alarmAudio.play()
}