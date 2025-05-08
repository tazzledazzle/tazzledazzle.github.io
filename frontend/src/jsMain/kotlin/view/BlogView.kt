// frontend/src/jsMain/kotlin/view/BlogView.kt
package view

import Post
import controller.ApiClient
import kotlinx.browser.document

fun renderPostList(posts: List<Post>) {
    val container = document.getElementById("app")!!
    container.innerHTML = posts.contentMarkdown.joinToString("\n") { post ->
//        post. {
//           div {
//                h2 { +"${post.title} (${post.date})" }
//                // contentMarkdown is already HTML
//                unsafe { +post.contentMarkdown }
//            }
//        }.outerHTML
    }
}

fun init() {
    ApiClient.fetchPosts { posts -> renderPostList(posts) }
}