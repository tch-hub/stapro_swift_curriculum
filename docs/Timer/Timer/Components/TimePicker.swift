//
//  TimePicker.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/11.
//

import SwiftUI

struct TimePicker: View {
    var title: String
    var range: ClosedRange<Int>
    @Binding var selection: Int
    
    var body: some View {
        Picker(selection: $selection, label: Text(title)) {
            ForEach(range, id: \.self) { value in
                Text("\(value) \(title)").tag(value)
            }
        }
        .pickerStyle(.wheel)
    }
}
