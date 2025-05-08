// backend/src/jvmMain/kotlin/Application.kt

import controller.postRoutes
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

fun main() {
    embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) {
            json()
        }
        routing {
            postRoutes()
            static("/") {
                resources("")  // serve frontend build artifacts
            }
        }
    }.start(wait = true)
}