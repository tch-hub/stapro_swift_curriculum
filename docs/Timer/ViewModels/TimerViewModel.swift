//
//  TimerViewModel.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/14.
//

import SwiftUI
import AVFoundation

class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle
    @Published var isShowingAlert = false
    var audioPlayer: AVAudioPlayer?
    var timer: Timer?
    var totalTime: Int = 0
    
    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
        countDown()
    }
    
    func stopTimer() {
        timerState = .idle
        timer?.invalidate()
    }
    
    func pauseTimer() {
        timerState = .paused
        timer?.invalidate()
    }
    
    func restartTimer() {
        timerState = .running
        countDown()
    }
    
    func playSound() {
        guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else {return}
        
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {
            print("音声ファイルが再生できませんでした")
        }
    }
    
    func countDown() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.isShowingAlert = true
                self.playSound()
            }
        }
    }
}
