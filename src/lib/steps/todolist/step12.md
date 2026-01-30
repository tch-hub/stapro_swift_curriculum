<script>
    import {base} from '$app/paths';
</script>

```swift
import Foundation
import SwiftData

class ToDoTabService {
    @MainActor
    static func addTab(_ tab: ToDoTab, to modelContext: ModelContext) {
        modelContext.insert(tab)
        try? modelContext.save()
    }

    @MainActor
    static func updateTab(_ tab: ToDoTab, modelContext: ModelContext) {
        try? modelContext.save()
    }

    @MainActor
    static func deleteTab(_ tab: ToDoTab, from modelContext: ModelContext) {
        // タブに属するタスクをすべて削除
        ToDoTaskService.deleteAllTasks(for: tab.id, from: modelContext)
        // タブを削除
        modelContext.delete(tab)
        try? modelContext.save()
    }

    @MainActor
    static func getAllTabs(from modelContext: ModelContext) -> [ToDoTab] {
        let descriptor = FetchDescriptor<ToDoTab>()
        return (try? modelContext.fetch(descriptor)) ?? []
    }
}
```
