// backend/src/jvmMain/kotlin/controller/PostController.kt
package controller

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import service.PostService

fun Routing.postRoutes() {
    get("/posts") {
        val posts = PostService.loadAll()
        call.respondText(Json.encodeToString(posts))
    }
    get("/posts/{id}") {
        val id = call.parameters["id"] ?: return@get call.respondText("Not found", status = HttpStatusCode.NotFound)
        val post = PostService.loadAll().find { it.id == id }
            ?: return@get call.respondText("Not found", status = HttpStatusCode.NotFound)
        call.respondText(Json.encodeToString(post))
    }
}