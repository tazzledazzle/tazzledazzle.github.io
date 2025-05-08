// backend/src/jvmMain/kotlin/service/PostService.kt
package service

import model.Post
import java.io.File

object PostService {
    fun loadAll(): List<Post> =
        File("resources/posts")
            .listFiles { _, name -> name.endsWith(".md") }
            ?.map { file ->
                val markdown = file.readText()  // Read the markdown file
                val html = com.vladsch.flexmark.html.HtmlRenderer.builder().build()
                    .render(com.vladsch.flexmark.parser.Parser.builder().build().parse(markdown))
                Post(
                    id = file.nameWithoutExtension,
                    title = markdown.lines().first().removePrefix("# "),
                    date = file.lastModified().toString(),
                    contentMarkdown = html
                )
            } ?: emptyList()
}