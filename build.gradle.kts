plugins {
    kotlin("multiplatform") version "1.9.0"
    id("org.jetbrains.kotlinx.kover") version "0.6.1"
    application
}

repositories {
    // Use the plugin portal to apply community plugins in convention plugins.
    gradlePluginPortal()
    mavenCentral()
}
kotlin {
    jvm {
        compilations.all {
            kotlinOptions {
                // Choose any supported target: “1.8”, “11”, or “17”
                jvmTarget = "17"
            }
        }
    }
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
                implementation(npm("markdown-it", "13.0.2"))
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-js:1.7.3")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json-js:1.6.0")
            }
        }
        val commonTest by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-test:1.9.0")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
                implementation("org.jetbrains.kotlin:kotlin-test-annotations-common:1.8.0")
            }
        }
        val jvmTest by getting {
            dependencies {
                implementation("io.ktor:ktor-server-tests-jvm:2.3.4")
//                implementation("org.jetbrains.kotlin:kotlin-test-junit5:1.9.0")
            }
        }
    }
}

application {
    mainClass.set("tazzledazzle.io.ApplicationKt")
}