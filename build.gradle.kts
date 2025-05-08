plugins {
    kotlin("multiplatform") version "1.9.0"
    application
}

repositories {
    // Use the plugin portal to apply community plugins in convention plugins.
    gradlePluginPortal()
    mavenCentral()
}
kotlin {
    jvm()
    js(IR) { browser() }
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:1.6.0")
            }
        }
        val jvmMain by getting {
            dependencies {
                implementation("io.ktor:ktor-server-core-jvm:2.3.4")
                implementation("com.vladsch.flexmark:flexmark-all:0.64.8")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core-jvm:1.6.0")
            }
        }
        val jsMain by getting {
            dependencies {
                implementation(npm("flexmark", "0.64.8"))
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-js:1.7.3")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json-js:1.6.0")
            }
        }
    }
}

application {
    mainClass.set("tazzledazzle.io.ApplicationKt")
}