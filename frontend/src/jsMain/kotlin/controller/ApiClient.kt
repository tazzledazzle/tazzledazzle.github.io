// frontend/src/jsMain/kotlin/controller/ApiClient.kt
package controller

import Post
import kotlinx.browser.window
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.await
import kotlinx.coroutines.launch
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

object ApiClient {
    private val scope = MainScope()

    fun fetchPosts(onResult: (List<Post>) -> Unit) {
        scope.launch {
            val resp = window.fetch("/posts").await().text().await()
            val posts = Json.decodeFromString<List<Post>>(resp)  // JSON decode  [oai_citation:2‡Coding_Concepts_Cookbook_Complete.pdf](file-service://file-XagGGVSpPt8oH3a9CiR4bA)
            onResult(posts)
        }
    }
}