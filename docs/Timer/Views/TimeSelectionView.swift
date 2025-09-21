//
//  TimeSelectionView.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/10.
//

import SwiftUI

struct TimeSelectionView: View {
    @Binding var hours: Int
    @Binding var minutes: Int
    @Binding var seconds: Int
    
    var body: some View {
        HStack {
            TimePicker(title: "時間", range: 0...23, selection: $hours)
            TimePicker(title: "分", range: 0...59, selection: $minutes)
            TimePicker(title: "秒", range: 0...59, selection: $seconds)
        }
    }
}
