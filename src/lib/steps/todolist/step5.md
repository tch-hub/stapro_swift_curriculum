# ステップ5: FloatingButton コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## FloatingButton.swift の作成

`Components/`フォルダに`FloatingButton.swift`を作成します：

```swift
import SwiftUI

struct FloatingButton: View {
    let action: () -> Void
    let icon: String
    let backgroundColor: Color

    var body: some View {
        VStack {
            Spacer()

            HStack {
                Spacer()

                Button(action: action) {
                    Image(systemName: icon)
                        .font(.system(size: 24))
                        .foregroundColor(.white)
                        .frame(width: 60, height: 60)
                        .background(backgroundColor)
                        .clipShape(Circle())
                        .shadow(radius: 5)
                }
                .padding(20)
            }
        }
    }
}

#Preview {
    FloatingButton(
        action: { },
        icon: "plus",
        backgroundColor: .blue
    )
}
```
