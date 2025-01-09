---
title: "Forge and Prep"
layout: "post"
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


Balance of responsibility between the client and the server in a client-server architecture.

```cpp
```

Deployment models for cloud computing.
* Public Cloud:
  * Services are provided over the public internet and available to anyone who wants to purchase them.
  * Examples: AWS, Azure, Google Cloud.
  * Advantages: Scalability, cost-effectiveness, no maintenance overhead.
* Private Cloud:
  * Services are maintained on a private network and are accessible only to a limited number of users.
  * Azure in a box
  * Advantages: Enhanced security, control over resources, customization.
  * Running on-premises or in a data center and utilized by different business divisions.
  * Usually managed by governmental agencies or large enterprises that secure any data.
* Hybrid Cloud: 
  * A combination of public and private clouds, allowing data and applications to be shared between them.
  * describes IT which spans data centers owned by corp and also utilizing cloud services.
  * Advantages: Flexibility, cost-efficiency, scalability.
* Community Cloud: 
  * Infrastructure is shared by several organizations with similar requirements and concerns.
  * Advantages: Cost-sharing, collaboration, industry-specific compliance.
  * run by third party or shared ownership of orgs


### What is the internet
* The internet is a global network of interconnected computers communicating or documents linked together using a common protocol.
#### URL --> Unified Resource Locator
* A URL is a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it.

#### HTTP --> HyperText Transfer Protocol
* HTTP is the foundation of data communication on the World Wide Web. It is used to load web pages using hypertext links.
* stateless

#### URI --> Uniform Resource Identifier
* A URI is a string of characters that identifies a particular resource. It can be a URL or a URN.
* A URI is a superset of a URL and a URN.


Http Client
* initiates a TCP connection to the server on port 80
* sends an HTTP request to the server over this TCP connection
* Request Methods
  * GET: Retrieve data from the server.
  * POST: Send data to the server to create a resource.
  * PUT: Send data to the server to update a resource.
  * DELETE: Delete a resource on the server.
  * HEAD: Retrieve only the headers of a response.
  * OPTIONS: Retrieve the communication options for the target resource.

Http Server
* listens for incoming connections on port 80
* receives the HTTP request from the client
* Returns an HTTP response to the client and closes the connection
* Response Status Codes
  * 1xx: Informational
  * 2xx: Success
  * 3xx: Redirection
  * 4xx: Client Error
  * 5xx: Server Error
* MIME Types
  * Multipurpose Internet Mail Extensions
  * Describes the type of data in a file
  * Examples: text/html, image/jpeg, application/json

### HTTP Internet Helpers
Web Caching
* Web caching is the process of storing copies of web resources to reduce bandwidth usage, server load, and latency.
* Caches can be located on the client side, server side, or between the client and server.
* Advantages: Faster load times, reduced server load, improved user experience.
* Disadvantages: Stale content, privacy concerns, cache consistency issues.
HTTP Internet Optimizations
* Intermediary servers
* forward proxy

Use the Postman tool to send HTTP requests and view responses.


Create an Http client in Java
```java
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
    
public class HttpClient {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://jsonplaceholder.typicode.com/posts/1");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
    
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            StringBuilder response = new StringBuilder();
    
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
    
            reader.close();
            connection.disconnect();
    
            System.out.println(response.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

Two arguments
* URL: The URL of the resource to be accessed.
* Number of Hops: The maximum number of hops allowed in the network.

```java
import java.util.*;

// Web Crawl
// Given a URL and the number of hops, return the list of URLs that can be visited within the specified number of hops.


public class WebCrawl {
    public static List<String> webCrawl(String url, int hops) {
        List<String> result = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        queue.offer(url);
        visited.add(url);
        int level = 0;
        while (!queue.isEmpty() && level <= hops) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String current = queue.poll();
                result.add(current);
                List<String> neighbors = getNeighbors(current);
                for (String neighbor : neighbors) {
                    if (!visited.contains(neighbor)) {
                        queue.offer(neighbor);
                        visited.add(neighbor);
                    }
                }
            }
            level++;
        }
        return result;
    }

    private static List<String> getNeighbors(String url) {
        // Dummy method to get neighbors of a URL
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        String url = "https://example.com";
        int hops = 2;
        List<String> result = webCrawl(url, hops);
        for (String link : result) {
            System.out.println(link);
        }
    }
}
```

```java
import java.util.*;

// Web Crawl
// Given a URL and the number of hops, return the list of URLs that can be visited within the specified number of hops.

public class WebCrawl {
    public static List<String> webCrawl(String url, int hops) {
        List<String> result = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        queue.offer(url);
        visited.add(url);
        int level = 0;
        while (!queue.isEmpty() && level <= hops) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String current = queue.poll();
                result.add(current);
                List<String> neighbors = getNeighbors(current);
                for (String neighbor : neighbors) {
                    if (!visited.contains(neighbor)) {
                        queue.offer(neighbor);
                        visited.add(neighbor);
                    }
                }
            }
            level++;
        }
        return result;
    }

    private static List<String> getNeighbors(String url) {
        // Dummy method to get neighbors of a URL
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        String url = "https://example.com";
        int hops = 2;
        List<String> result = webCrawl(url, hops);
        for (String link : result) {
            System.out.println(link);
        }
    }
}
```
