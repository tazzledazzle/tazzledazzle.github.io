---
title: "Design Document for Project 5: macOS Disk Usage Visualizer"
layout: "post"
---

# Design Document for Project 5: macOS Disk Usage Visualizer

1. Title and Overview

Project Name: macOS Disk Usage Visualizer
Objective:
Build a cross-platform application using Java and C++ that visualizes disk usage in macOS. The project combines a C++ disk usage scanner with a Java-based visualization tool.

2. Goals and Non-Goals

Goals:
	•	Develop a high-performance disk usage scanner in C++.
	•	Provide a tree-map or bar-chart visualization using JavaFX.
	•	Ensure compatibility across multiple macOS versions.

Non-Goals:
	•	Compatibility with Windows or Linux systems.
	•	Advanced visualization features like zoom or real-time updates.

3. Design Overview
	•	Input: Root directory path provided by the user.
	•	Output: Visualization of disk usage, including folder sizes and file details.
	•	Architecture:
	•	C++ Disk Scanner: Scans the directory and calculates folder sizes.
	•	Java Frontend: Visualizes the scanned data.
	•	JNI Interface: Facilitates communication between Java and C++.

4. System Design

4.1 Components
	•	Disk Scanner (C++):
	•	Traverses the directory recursively to calculate sizes.
	•	Outputs results in a structured format (e.g., JSON).
	•	Java Visualizer:
	•	Parses the JSON output and renders a visualization using JavaFX.
	•	JNI Bridge:
	•	Connects the Java application with the C++ scanner for seamless integration.

4.2 Workflow
	1.	Input Handling:
	•	User provides the root directory path.
	2.	Scanning:
	•	The Disk Scanner processes the directory and generates a JSON file.
	3.	Data Parsing:
	•	The Java Visualizer reads and parses the JSON output.
	4.	Visualization:
	•	JavaFX renders a tree map or bar chart.
	5.	Output:
	•	Disk usage data is displayed, highlighting large files and directories.

5. API and Data Structures

5.1 Core Data Structures
	•	FileInfo (C++):

struct FileInfo {
    std::string name;
    uint64_t size;
    std::vector<FileInfo> children;
};


	•	JSON Schema:

{
    "name": "root",
    "size": 100000,
    "children": [
        { "name": "folder1", "size": 50000, "children": [] },
        { "name": "folder2", "size": 50000, "children": [] }
    ]
}



5.2 Interfaces
	•	Disk Scanner:

FileInfo scanDirectory(const std::string& rootPath);


	•	Java Parser:

List<FileInfo> parseJson(String jsonFilePath);


	•	JNI Interface:

public native String scanDisk(String rootPath);

6. Multithreading Strategy
	•	Disk Scanner: Use multithreading for traversing subdirectories concurrently.
	•	Load Balancing: Assign threads based on directory size to prevent bottlenecks.

7. Testing
	•	Unit Testing: Verify the correctness of directory traversal and JSON generation.
	•	Integration Testing: Ensure seamless interaction between C++ and Java components.
	•	Visualization Testing:
	•	Validate chart rendering for large and complex directory structures.
	•	Test responsiveness of JavaFX.
