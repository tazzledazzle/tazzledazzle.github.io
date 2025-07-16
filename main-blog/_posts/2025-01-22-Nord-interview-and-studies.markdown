---
title: Nord Interview and Studies
layout: page
---

## **Introduction**

Bazel is a powerful build and test tool from Google that supports projects in multiple languages and platforms. This cookbook provides 30 essential recipes to help you solve common build and development challenges using Bazel.

### 1. Setting Up a Basic Bazel Workspace

**Problem:** You need to initialize a new Bazel workspace for your project.

**Solution:**

1. **Create a Workspace Directory**

```bash
mkdir my_project
cd my_project
```

1. **Add a** `WORKSPACE` **File:**

Create an empty WORKSPACE file in the root directory.

```bash
touch WORKSPACE
```

1. **Add a** `BUILD` **File:**

Create a `BUILD` file where you’ll define build rules.

```bash
touch BUILD
```

**Discussion:**

The `WORKSPACE` file tells Bazel that this directory is the root of a Bazel workspace. The `BUILD`files define how Bazel should build your code.

### 2. Writing a Simple Build Rule

**Problem:** You want to compile a simple C++ program with Bazel.

**Solution:**

1. **Project Structure:**

<pre class="tree-diagram">
my_project/
├── WORKSPACE
├── BUILD
└── main.cpp
</pre>

2. **Write** `main.cpp`**:**

```cpp
// main.cpp

# include <iostream>

int main() {
    std::cout << "Hello, Bazel!" << std::endl;
    return 0;
}

```

3. **Define a Build Rule in** `BUILD`**:**

```python
cc_binary(
    name = "hello_world",
    srcs = ["main.cpp"],
)
```

4. **Build and Run:**

```bash
bazel run //:hello_world
```

**Discussion:**

The cc_binary rule tells Bazel to build a C++ binary from the source file.

### 3. Compiling a Java Project

**Problem:** Build a simple Java application using Bazel.

**Solution:**

1. **Project Structure:**

<pre class="tree-diagram">
my_project/
├── WORKSPACE
├── BUILD
└── Main.java
</pre>

 2. **Write** `Main.java`**:**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Bazel!");
    }
}
```

 3. **Define a Build Rule in** BUILD**:**

```python
java_binary(
    name = "hello_java",
    srcs = ["Main.java"],
    main_class = "Main",
)
```

 4. **Build and Run:**

```bash
bazel run //:hello_java
```

**Discussion:**

The `java_binary` rule compiles Java source files and specifies the main class.

### 4. Using External Dependencies

**Problem:** Include external libraries in your Bazel build.

**Solution:**

1. **Update** `WORKSPACE` **to Include the Dependency:**

```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "com_google_guava_guava",
    urls = ["https://github.com/google/guava/archive/v31.0.1.tar.gz"],
    strip_prefix = "guava-31.0.1",
)
```

2. **Add** `BUILD` **Rule:**

```python
java_binary(
    name = "app_with_guava",
    srcs = ["App.java"],
    main_class = "App",
    deps = ["@com_google_guava_guava//:guava"],
)
```

**Discussion:**

Using `http_archive`, you can fetch external dependencies. The deps attribute in the build rule includes them in your build.

### 5. Writing a Custom Build Rule

**Problem:** Create a custom rule to process files in a unique way.

**Solution:**

1. **Define a Skylark Rule in** `build_rules.bzl` **:**

<pre><code class="language-python">
def _custom_rule_impl(ctx):
    # Implementation logic
    pass

    custom_rule = rule(
        implementation =_custom_rule_impl,
        attrs = {
        "srcs": attr.label_list(allow_files = True),
        },
    )
</code></pre>

 2. **Load and Use the Rule in** BUILD**:**

load("//:build_rules.bzl", "custom_rule")

custom_rule(
name = "process_files",
srcs = ["file1.txt", "file2.txt"],
)

**Discussion:**

Custom rules allow you to extend Bazel’s functionality using Skylark, Bazel’s extension language.

### 6. Building Multiple Targets

**Problem:** Build multiple binaries or libraries in the same project.

**Solution:**

1. **Define Multiple Targets in** BUILD**:**

<pre><code class="language-python">
cc_library(
name = "util",
srcs = ["util.cpp"],
)

cc_binary(
name = "app1",
srcs = ["app1.cpp"],
deps = [":util"],
)

cc_binary(
name = "app2",
srcs = ["app2.cpp"],
deps = [":util"],
)
</code></pre>

 2. **Build Specific Target:**

```bash
bazel build //:app1
```

**Discussion:**

By defining multiple targets, you can build and manage several binaries or libraries within the same workspace.

### 7. Generating Documentation

**Problem:** Generate documentation from your source code using Bazel.

**Solution:**

1. **Use** `genrule` **to Run Documentation Tool:**

<pre><code class="language-python">

genrule(
    name = "generate_docs",
    srcs = glob(["*.java"]),
    outs = ["docs.zip"],
    cmd = "javadoc $(SRCS) -d $(GENDIR)/docs && zip -r $@ $(GENDIR)/docs",
)

</code></pre>

 2. **Build the Documentation:**

```bash
    bazel build //:generate_docs
```

**Discussion:**

The `genrule` allows you to run custom shell commands as part of the build process.

### 8. Running Tests with Bazel

**Problem:** Integrate and run tests for your codebase.

**Solution:**

1. **Write Test Files (e.g.,** `MainTest.java`**):**

<pre><code class="language-java">

import org.junit.Test;
import static org.junit.Assert.*;

public class MainTest {
    @Test
    public void testMain() {
        assertEquals(1, 1);
    }
}
</code></pre>

 2. **Define a Test Rule in** `BUILD`**:**

<pre><code class="language-python">

java_test(
    name = "main_test",
    srcs = ["MainTest.java"],
    deps = ["@junit//jar"],
)
</code></pre>

 3. **Run the Tests:**

```bash
    bazel test //:main_test
```

**Discussion:**

Bazel’s test rules allow you to run tests and integrate them into your build process.

### 9. Using Bazel Query

**Problem:** Analyze dependencies and understand the build graph.

**Solution:**

1. **Run a Query to Find All Dependencies:**

```bash
    bazel query 'deps(//:app)'
```

 2. **Visualize the Build Graph:**

```bash
    bazel query 'deps(//:app)' --output graph > graph.in
    dot -Tpng graph.in -o graph.png
```

**Discussion:**

Bazel Query is a powerful tool for inspecting the build graph and dependencies.

### 10. Using Bazel’s Remote Caching

**Problem:** Speed up builds by using remote caching.

**Solution:**

1. **Start a Remote Cache Service (e.g., Bazel Remote Cache).**
2. **Configure Bazel to Use Remote Cache:**

```bash
    bazel build //:target --remote_cache=<http://cache-server:8080>
```

**Discussion:**

Remote caching allows build artifacts to be shared across different machines, speeding up builds.

### 11. Cross-compiling with Bazel

**Problem:** Build code for a different architecture or platform.

**Solution:**

1. **Define a Toolchain:**

<pre><code class="language-python">
toolchain(
    name = "linux_arm_toolchain",
    toolchain_type = "@bazel_tools//tools/cpp:toolchain_type",
    target_cpu = "arm",
)
</code></pre>

 2. **Select the Toolchain When Building:**

```bash
    bazel build //:app --cpu=arm
```

**Discussion:**

By specifying the target CPU or platform, Bazel can cross-compile code.

### 12. Building a Python Project

**Problem:** Use Bazel to build and run Python applications.

**Solution:**

1. **Project Structure:**

<pre><code class="tree-diagram">

my_project/
├── WORKSPACE
├── BUILD
└── app.py
</code></pre>

 2. **Write** `app.py`**:**

<pre><code class="language-python">
print("Hello, Bazel with Python!")
</code></pre>

 3. **Define a Build Rule in** `BUILD`**:**

<pre><code class="language-python">
py_binary(
    name = "app",
    srcs = ["app.py"],
)
</code></pre>

 4. **Run the Application:**

```bash
    bazel run //:app
```

**Discussion:**

Bazel supports Python through the py_binary and py_library rules.

### 13. Using Bazel with Docker

**Problem:** Build Docker images using Bazel.

**Solution:**

1. **Define a Docker Image Rule:**

<pre><code class="language-python">
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

container_image(
    name = "app_image",
    base = "@//base_image",
    files = ["app.py"],
    cmd = ["python", "app.py"],
)
</code></pre>

 2. **Build the Docker Image:**

```bash
    bazel build //:app_image
```

**Discussion:**

Using `rules_docker`, Bazel can build and manage Docker images as part of your build process.

### 14. Integrating Bazel with IDEs

**Problem:** Improve development workflow by integrating Bazel with your IDE.

**Solution:**

1. **Use Plugins:**

* **IntelliJ IDEA:** Install the Bazel plugin from the JetBrains marketplace.
* **Visual Studio Code:** Use the Bazel build extensions available.

2. **Configure the Plugin with Your Workspace:**

* Point the plugin to your Bazel workspace and sync the project.

**Discussion:**

IDE integration allows for features like code completion and debugging while using Bazel builds.

### 15. Using Toolchains in Bazel

**Problem:** Customize the tools used during the build process.

**Solution:**

1. **Define a Custom Toolchain:**

<pre><code class="language-python">
toolchain(
name = "my_toolchain",
toolchain_type = "@bazel_tools//tools/cpp:toolchain_type",
toolchain = "//tools:my_compiler",
)
</code></pre>

 2. **Register the Toolchain in** `WORKSPACE`**:**

<pre><code class="language-python">
register_toolchains("//tools:my_toolchain")
</code></pre>

**Discussion:**

Toolchains allow you to specify different compilers or build tools for your project.

### 16. Building Go Projects

**Problem:** Build Go applications with Bazel.

**Solution:**

1. **Set Up Go Rules in** `WORKSPACE`**:**

<pre><code class="language-python">
load("@bazel_gazelle//:deps.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()
go_register_toolchains()
</code></pre>

 2. **Write** BUILD **File:**

<pre><code class="language-python">
load("@io_bazel_rules_go//go:def.bzl", "go_binary")

go_binary(
name = "hello_go",
srcs = ["main.go"],
)
</code></pre>

3. **Write** `main.go`**:**

<pre><code class="language-go">
package main

import "fmt"

func main() {
    fmt.Println("Hello, Bazel with Go!")
}
</code></pre>

 4. **Build and Run:**

```bash
    bazel run //:hello_go
```

**Discussion:**
Bazel’s Go rules enable seamless building and testing of Go applications.

### 17. Using Bazel’s Configurations

**Problem:** Build the project with different configurations (e.g., debug, release).
**Solution:**

1. **Define Configurations in** `BUILD`**:**

<pre><code class="language-python">
config_setting(
    name = "debug_mode",
    values = {"compilation_mode": "dbg"},
)
</code></pre>

2. **Use Select Statements:**

<pre><code class="language-python">
cc_binary(
    name = "app",
    srcs = ["app.cpp"],
    copts = select({
        ":debug_mode": ["-g"],
        "//conditions:default": ["-O2"],
    }),
)
</code></pre>

 3. **Build with Configuration:**

```bash
bazel build //:app -c dbg
```

**Discussion:**
Configurations allow for flexible build options based on specified conditions.

### 18. Optimizing Build Performance

**Problem:** Improve the speed of your Bazel builds.
**Solution:**

1. **Enable Build Caching:**

```bash
bazel build //:target --disk_cache=~/.bazel-cache
```

2. **Use Remote Execution Services.**
3. **Avoid Unnecessary Rebuilds:**

* Ensure that only changed files trigger rebuilds.
* Use finer-grained targets.

**Discussion:**
Optimizing build performance can save time and resources, especially in large projects.

### 19. Handling Protobufs

**Problem:** Compile Protocol Buffer definitions in your build.
**Solution:**

1. **Set Up Protobuf Dependencies in** `WORKSPACE`**:**

<pre><code class="language-python">
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

git_repository(
    name = "com_google_protobuf",
    remote = "https://github.com/protocolbuffers/protobuf.git",
    tag = "v3.17.3",
)
</code></pre>

 2. **Define Build Rules in** `BUILD`**:**

<pre><code class="language-python">
proto_library(
    name = "my_proto",
    srcs = ["my.proto"],
)

cc_proto_library(
    name = "my_proto_cc",
    deps = [":my_proto"],
)
</code></pre>

**Discussion:**
Bazel’s proto rules automate the compilation of `.proto` files into source code.

### 20. Building Android Apps

**Problem:** Build an Android application using Bazel.
**Solution:**

1. **Set Up Android SDK in** `WORKSPACE`**:**

<pre><code class="language-python">
android_sdk_repository(
    name = "androidsdk",
    path = "/path/to/android/sdk",
)
</code></pre>

2. **Define Android Binary in** `BUILD`**:**

<pre><code class="language-python">
android_binary(
    name = "my_app",
    srcs = glob(["*.java"]),
    manifest = "AndroidManifest.xml",
)
</code></pre>

 3. **Build the APK:**

```bash
    bazel build //:my_app
```

**Discussion:**
Bazel provides robust support for Android development, including resource processing and APK building.

### 21. Managing Build Outputs

**Problem:** Control where Bazel places its build outputs.
**Solution:**

1. **Use** `--output_base`**:**

```bash
    bazel build //:target --output_base=/path/to/output_base
```

 2. **Use** --symlink_prefix**:**

```bash
    bazel build //:target --symlink_prefix=/path/to/symlinks/
```

**Discussion:**
Adjusting output locations can help with build management and integration with other tools.

### 22. Writing Skylark Extensions

**Problem:** Extend Bazel’s functionality with custom Skylark extensions.
**Solution:**

1. **Create a** `.bzl` **File with Extension Functions:**

<pre><code class="language-python">
def greet(name):
    print("Hello, {}!".format(name))
</code></pre>

2. **Load and Use in** `BUILD`**:**

<pre><code class="language-python">
load("//:extensions.bzl", "greet")

greet("Bazel User")
</code></pre>

**Discussion:**
Skylark extensions allow you to write custom build logic in a Python-like language.

### 23. Using Bazel with Continuous Integration

**Problem:** Integrate Bazel builds into a CI/CD pipeline.
**Solution:**

1. **Write Build Scripts:**

* Create scripts that can be called by your CI system to build and test your project.

2. **Configure CI System:**

* Set up your CI tool (e.g., Jenkins, GitLab CI) to invoke Bazel commands.

3. **Cache Artifacts:**

* Use remote caching to speed up CI builds.
**Discussion:**
Integrating Bazel with CI/CD ensures consistent builds and tests across environments.

### 24. Handling Versioning

**Problem:** Manage different versions of dependencies in your Bazel project.
**Solution:**

1. **Use Multiple External Repositories:**

<pre><code class="language-python">
http_archive(
    name = "lib_v1",
    urls = ["https://example.com/lib-1.0.tar.gz"],
)

http_archive(
    name = "lib_v2",
    urls = ["https://example.com/lib-2.0.tar.gz"],
)
</code></pre>

 2. **Specify Versions in Dependencies:**

<pre><code class="language-python">
cc_binary(
    name = "app_v1",
    srcs = ["app.cpp"],
    deps = ["@lib_v1//:lib"],
)

cc_binary(
    name = "app_v2",
    srcs = ["app.cpp"],
    deps = ["@lib_v2//:lib"],
)
</code></pre>

**Discussion:**
Bazel’s external dependencies can point to different versions, allowing side-by-side usage.

### 25. Advanced Testing Techniques

**Problem:** Implement more sophisticated testing strategies.
**Solution:**

1. **Parametrized Tests:**

* Use test frameworks that support parametrized tests and integrate them with Bazel.

2. **Test Suites:**

<pre><code class="language-python">
test_suite(
    name = "all_tests",
    tests = [
        ":test1",
        ":test2",
    ],
)
</code></pre>

 3. **Shard Tests for Parallel Execution:**

```bash
    bazel test //:all_tests --test_sharding_strategy=experimental_heuristic
```

**Discussion:**
Advanced testing configurations can improve test coverage and execution time.

### 26. Using Bazel for Large Projects

**Problem:** Scale Bazel to handle large codebases.
**Solution:**

1. **Use Fine-Grained Targets:**

* Break down the codebase into smaller libraries and binaries.

2. **Leverage Remote Build Execution:**

* Distribute build and test actions across multiple machines.

3. **Optimize Dependencies:**

* Reduce unnecessary dependencies to minimize rebuilds.
**Discussion:**
Proper structuring and resource utilization are key for scaling Bazel in large projects.

### 27. Debugging Builds

**Problem:** Troubleshoot build issues in Bazel.
**Solution:**

1. **Use Verbose Output:**

```bash
bazel build //:target -s
```

 2. **Inspect Build Graph:**

```bash
bazel query 'allpaths(//:target, //:dependency)'
```

 3. **Check Logs:**

* Review Bazel’s log files for errors and warnings.

**Discussion:**
Debugging tools and commands help identify and resolve build problems.

### 28. Migrating to Bazel

**Problem:** Transition an existing project to use Bazel.
**Solution:**

1. **Start Small:**

* Begin by writing Bazel build files for a small part of the project.

2. **Automate BUILD File Generation:**

* Use tools like bazelify or gazelle for Go projects.

3. **Incrementally Migrate:**

* Gradually replace existing build tools with Bazel.

**Discussion:**
A phased approach reduces risk and eases the transition to Bazel.

### 29. Handling Generated Sources

**Problem:** Include generated code in your build process.
**Solution:**

1. **Use** `genrule` **to Generate Sources:**

<pre><code class="language-python">
genrule(
    name = "generate_source",
    outs = ["generated.cpp"],
    cmd = "python generate.py > $@",
)
</code></pre>

 2. **Depend on Generated Sources:**

<pre><code class="language-python">

cc_binary(
    name = "app",
    srcs = ["main.cpp", ":generate_source"],
)
</code></pre>

**Discussion:**

Generated sources can be seamlessly integrated into the build process using genrules.

### 30. Best Practices and Tips

**Problem:** Adopt best practices for efficient Bazel usage.

**Solution:**

1. **Consistent Naming Conventions:**

* Use clear and consistent target names.

2. **Keep BUILD Files Simple:**

* Avoid complex logic; use Skylark extensions when necessary.

3. **Minimize Global State:**

* Keep workspace configurations minimal to avoid unintended interactions.

4. **Regularly Update Bazel:**

* Stay current with Bazel releases for performance improvements and new features.

**Discussion:**

Following best practices leads to more maintainable and efficient build systems.

**Conclusion**

This cookbook has provided concise solutions to common problems encountered when using Bazel. By applying these recipes, you can enhance your build process, improve performance, and streamline development workflows.
