// frontend/src/jsMain/kotlin/controller/ApiClient.kt
package controller

import Post
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import java.awt.SystemColor.window


object ApiClient {
    private val scope = MainScope()

    fun fetchPosts(onResult: (List<Post>) -> Unit) {
        scope.launch {

        }
    }
}