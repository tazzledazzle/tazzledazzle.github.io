import org.gradle.kotlin.dsl.implementation

plugins {
    kotlin("jvm") version "2.1.10"
    alias(libs.plugins.compose.compiler)
    application
}

repositories {
    // Use the plugin portal to apply community plugins in convention plugins.
    gradlePluginPortal()
    maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
    mavenCentral()
}
dependencies {
    implementation("io.ktor:ktor-server-core-jvm:2.3.4")
    implementation(libs.compose.runtime)
    implementation("io.ktor:ktor-server-netty:2.3.4")
    implementation("io.ktor:ktor-server-html-builder:2.3.4")
    implementation("com.vladsch.flexmark:flexmark-all:0.64.8")
    implementation("org.jetbrains.kotlinx:kotlinx-html:0.12.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
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