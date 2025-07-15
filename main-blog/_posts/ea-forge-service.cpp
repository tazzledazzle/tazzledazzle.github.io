#include <string>
#include<iostream>
#include <utility>

class Item {
private:
    std::string name;
    int quantity;
    float price;

public:
    Item(std::string name, int quantity, float price) : name{std::move(name)}, quantity{quantity}, price{price} {}

    std::string get_name() const {
        return name;
    }

    int get_quantity() const {
        return quantity;
    }

    void set_quantity(int new_quantity) {
        quantity = new_quantity;
    }

    float get_price() const {
        return price;
    }

    bool is_match(const std::string &other) {
        return name == other;
    }
};

class Inventory {
private:
    std::vector<std::unique_ptr<Item>> items;
    float total_money;
    int item_count;

    void display_data() const {
        std::cout << "\nItem name: " << get_name();
        std::cout << "\nQuantity: " << get_quantity();
        std::cout << "\nPrice: " << get_price();
    }

public:
    Inventory() : items{}, total_money{0}, item_count{0} {}

    void add_item() {
        auto item = create_item();
        items.push_back(std::move(item));
        item_count++;
    }

    std::unique_ptr<Item> create_item() {
        std::string name;
        int quantity;
        float price;

        std::cin.ignore();
        std::cout << "\nEnter item name: ";
        std::cin >> name;
        std::cout << "Enter quantity: ";
        std::cin >> quantity;
        std::cout << "Enter price: ";
        std::cin >> price;

        return std::make_unique<Item>(name, quantity, price);
    }

    int match_index(const std::string& item_to_check) {
        for (int i = 0; i < item_count; i++) {
            if (*items[i]->is_match(item_to_check)) {
                return i;

            }
        }
        return -1;
    }

    void sell_item() {
        std::string item_to_check;
        std::cin.ignore();
        std::cout << "\nEnter item name: ";
        std::cin >> item_to_check;
        int index = match_index(item_to_check);
        if (index == -1) {
            std::cout << "\nThis item is not in your Inventory";
            return;
        }
        process_sale(index);
    }

    void process_sale(int index) {
        int input_quantity;
        Item *item = items[index].get();
        std::cout << "\nEnter number of items to sell: ";
        std::cin >> input_quantity;

        // calculate how much money is earned and how many items remain
        int quantity = item->get_quantity();
        if (quantity == input_quantity) {
            remove_item(index);
        } else if (input_quantity < quantity) {
            float price = item->get_price();
            float money_earned = price * input_quantity;
            item->set_quantity(quantity - input_quantity);
            std::cout << "\nItems sold";
            std::cout << "\nMoney received: " << money_earned;
            total_money += money_earned;
        } else {
            std::cout << "\nCannot sell more items than you have.";
        }
    }

    void remove_item(int item_index) {
        if (item_index < 0 || item_index >= item_count) {
            std::cout << "Invalid index\n";
            return;
        }

        items.erase(items.begin() + item_index);
        item_count--;
    }

    void list_items() {
        if (item_count == 0) {
            std::cout << "\nInventory empty.";
            return;
        }

        for (int i = 0; i < item_count; i++) {
            items[i]->display_data();
            std::cout << "\n";
        }
    }
};

// no need to modify anything here
int main() {
    int choice;
    Inventory inventory_system;
    std::cout << "Welcome to the inventory!";

    while (1) {
        std::cout << "\n\nMENU\n"
                  << "1. Add new item\n"
                  << "2. Sell item\n"
                  << "3. List items\n"
                  << "4. Exit\n\n"
                  << "Enter your choice: ";
        std::cin >> choice;

        switch (choice) {
            case 1:
                inventory_system.add_item();
                break;

            case 2:
                inventory_system.sell_item();
                break;

            case 3:
                inventory_system.list_items();
                break;

            case 4:
                exit(0);

            default:
                std::cout << "\nInvalid choice entered";
                std::cin.clear();
                std::cin.ignore(INT_MAX, '\n');
                break;
        }
    }
}

/*Electronic Arts Software Engineering virtual experience program on Forage -
January 2025*/

/* * Proposed a new feature for the Sims 4 and wrote a Feature Proposal describing
   it to other stakeholders.
 * Built a class diagram and created a header file in C++ with class definitions
   for each object.
 * Patched a bugfix and optimized the Sims 4 codebase by implementing an
   improved data structure.*/
//////////////////////////////////////////////////////////////////////////////////////////////////////

/* Model Answer */
#include <string>
#include<iostream>
#include <utility>
#include <vector>

class Item {
private:
    std::string name;
    int quantity;
    float price;

public:
    Item(
            std::string name,
            int quantity,
            float price
    ) :
            name{std::move(name)},
            quantity{quantity},
            price{price} {

    }

    std::string get_name() const {
        return name;
    }

    int get_quantity() const {
        return quantity;
    }

    void set_quantity(int new_quantity) {
        quantity = new_quantity;
    }

    float get_price() const {
        return price;
    }

    bool is_match(const std::string &other) {
        return name == other;
    }
};

class Inventory {
private:
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // we'll change the item array to be a vector instead. These have bounds checking, are stored on the heap, //
    // can be grown or shrunk at runtime, and are just generally easier to work with.                          //
    // note that we'll be keeping track of unique pointers to items, so they are properly deallocated when     //
    // removed from the vector                                                                                 //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    std::vector<std::unique_ptr<Item>> items;
    float total_money;

    // we no longer need to track item count manually, we can simply ask the vector
    // int item_count;

    static void display_data(Item &item) {
        std::cout << "\nItem name: " << item.get_name();
        std::cout << "\nQuantity: " << item.get_quantity();
        std::cout << "\nPrice: " << item.get_price();
    }

public:
    Inventory() :
            items{},
            total_money{0} {

    }

    void add_item() {
        std::string name;
        int quantity;
        float price;

        std::cin.ignore();
        std::cout << "\nEnter item name: ";
        std::cin >> name;
        std::cout << "Enter quantity: ";
        std::cin >> quantity;
        std::cout << "Enter price: ";
        std::cin >> price;

        items.push_back(std::make_unique<Item>(name, quantity, price));
    }

    void sell_item() {
        std::string item_to_check;
        std::cin.ignore();
        std::cout << "\nEnter item name: ";
        std::cin >> item_to_check;

        for (int i = 0; i < items.size(); i++) {
            if (items[i]->is_match(item_to_check)) {
                remove_item(i);
                return;
            }
        }
        std::cout << "\nThis item is not in your Inventory";
    }

    void remove_item(int item_index) {
        int input_quantity;
        Item &item = *items[item_index];
        std::cout << "\nEnter number of items to sell: ";
        std::cin >> input_quantity;

        int quantity = item.get_quantity();
        if (input_quantity <= quantity) {
            float price = item.get_price();
            float money_earned = price * input_quantity;
            item.set_quantity(quantity - input_quantity);

            /////////////////////////////////////////////////////////////////////////////////////////////////
            // this is where we need to make the change - simply remove the item if the quantity hits zero //
            /////////////////////////////////////////////////////////////////////////////////////////////////
            if (item.get_quantity() == 0) {
                items.erase(items.begin() + item_index);
            }

            std::cout << "\nItems sold";
            std::cout << "\nMoney received: " << money_earned;
            total_money += money_earned;
        } else {
            std::cout << "\nCannot sell more items than you have.";
        }
    }

    void list_items() {
        if (items.empty()) {
            std::cout << "\nInventory empty.";
            return;
        }

        for (auto &item: items) {
            display_data(*item);
            std::cout << "\n";
        }
    }
};

// no need to modify anything here
int main() {
    int choice;
    Inventory inventory_system;
    std::cout << "Welcome to the inventory!";

    while (1) {
        std::cout << "\n\nMENU\n"
                  << "1. Add new item\n"
                  << "2. Sell item\n"
                  << "3. List items\n"
                  << "4. Exit\n\n"
                  << "Enter your choice: ";
        std::cin >> choice;

        switch (choice) {
            case 1:
                inventory_system.add_item();
                break;

            case 2:
                inventory_system.sell_item();
                break;

            case 3:
                inventory_system.list_items();
                break;

            case 4:
                exit(0);

            default:
                std::cout << "\nInvalid choice entered";
                std::cin.clear();
                std::cin.ignore(INT_MAX, '\n');
                break;
        }
    }
}