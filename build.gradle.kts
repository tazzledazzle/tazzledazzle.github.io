import org.gradle.kotlin.dsl.implementation

plugins {
    kotlin("multiplatform") version "1.9.0"
    id("org.jetbrains.kotlinx.kover") version "0.6.1"
//    id("maven-publish")
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.kobweb.application)
    alias(libs.plugins.kobwebx.markdown)
//    application
}

repositories {
    // Use the plugin portal to apply community plugins in convention plugins.
    gradlePluginPortal()
    maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
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
    js(IR) {
        browser()
        binaries.executable()
    }

    sourceSets {
        val commonMain by getting {
            kotlin.srcDir("common/src")
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
                implementation("org.jetbrains.compose:org.jetbrains.compose.gradle.plugin:1.8.0")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:1.6.0")
            }
        }
        // backend
        val jvmMain by getting {
            dependsOn(commonMain)
            kotlin.srcDir("backend/src/jvmMain/kotlin")
            kotlin.srcDir("backend/src")
            dependencies {
                api("io.ktor:ktor-server-core-jvm:2.3.4")
                implementation("com.vladsch.flexmark:flexmark-all:0.64.8")
                api("org.jetbrains.kotlinx:kotlinx-serialization-core-jvm:1.6.0")
            }
        }
        // frontend
        val jsMain by getting {
            dependsOn(commonMain)
            kotlin.srcDir("frontend/src/jsMain/kotlin")
            kotlin.srcDir("frontend/src")
            dependencies {
                implementation(npm("markdown-it", "13.0.2"))
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-js:1.7.3")
                implementation("org.jetbrains.kotlinx:kotlinx-html:0.12.0")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json-js:1.6.0")
                implementation(libs.compose.html.core)
                implementation(libs.kobweb.core)
                implementation(libs.kobwebx.markdown)
                implementation(libs.compose.runtime)
                implementation(libs.kobweb.silk)
            }
        }
        // tests
        val commonTest by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-test:1.9.0")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
                implementation("org.jetbrains.kotlin:kotlin-test-annotations-common:1.8.0")
            }
        }
        val jvmTest by getting {
            dependsOn(jvmMain)
            dependencies {
                implementation("io.ktor:ktor-server-tests-jvm:2.3.4")
            }
        }
    }
}


group = "tazzledazzle.io"
version = "1.0"

application {
    mainClass.set("tazzledazzle.io.ApplicationKt")
}

//publishing {
//    repositories {
//        maven {
//            name = "tazzledazzle-io-gh-pages"
//            url = uri("https://maven.pkg.github.com/tazzledazzle/tazzledazzle-io")
//            credentials {
//                // TODO: Uncomment and set your credentials
////                username = project.findProperty("gpr.user") as String? ?: System.getenv("USERNAME")
////                password = project.findProperty("gpr.token") as String? ?: System.getenv("TOKEN")
//            }
//        }
//    }
//}