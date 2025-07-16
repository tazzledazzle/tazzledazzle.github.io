---
layout: page
title: "Deleting index from array"
---


I'm saving this in case I need to refer back to it later.
This is an example of removing an item from an array of pointers to objects in C++.

```cpp
#include <iostream>

class Item {
public:
    int value;
    Item(int v) : value(v) {}
};

void removeItem(Item *items[], int& size, int index) {
    if (index < 0 || index >= size) {
        std::cout << "Invalid index\n";
        return;
    }

    // Free the memory of the item at the index
    delete items[index];

    // Shift elements to the left to fill the gap
    for (int i = index; i < size - 1; ++i) {
        items[i] = items[i + 1];
    }

    // Set the last pointer to nullptr (optional)
    items[size - 1] = nullptr;

    // Decrease the logical size of the array
    --size;
}

int main() {
    const int capacity = 20;
    int size = 5; // Current number of items in the array
    Item *items[capacity] = {nullptr};

    // Populate the array
    for (int i = 0; i < size; ++i) {
        items[i] = new Item(i * 10); // Dynamically allocate Items
    }

    // Display before removal
    std::cout << "Before removal:\n";
    for (int i = 0; i < size; ++i) {
        std::cout << "Item " << i << ": " << items[i]->value << "\n";
    }

    // Remove item at index 2
    removeItem(items, size, 2);

    // Display after removal
    std::cout << "\nAfter removal:\n";
    for (int i = 0; i < size; ++i) {
        std::cout << "Item " << i << ": " << items[i]->value << "\n";
    }

    // Clean up remaining memory
    for (int i = 0; i < size; ++i) {
        delete items[i];
    }

    return 0;
}

```