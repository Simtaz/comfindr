const searchForm = document.getElementById("searchForm");

const searchButton = document.getElementById("searchButton");

const resultsBox = document.getElementById("results");


// =========================================================
// SEARCH
// =========================================================

searchForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const videoUrl =
        document.getElementById("video_url").value.trim();


    const searchWord =
        document.getElementById("search_word").value.trim();


    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!videoUrl || !searchWord) {

        resultsBox.innerHTML = `
            <div class="error">
                Please enter the YouTube video link
                and search word.
            </div>
        `;

        return;
    }


    // -------------------------------------------------------
    // DISABLE BUTTON
    // -------------------------------------------------------

    searchButton.disabled = true;

    searchButton.innerText = "Searching...";


    // -------------------------------------------------------
    // LOADING
    // -------------------------------------------------------

    resultsBox.innerHTML = `

        <div class="loading">

            Fetching comments...

            <br><br>

            This may take a few minutes.

        </div>

    `;


    try {

        console.log(
            "[COMFINDR] Sending search request..."
        );


        // =================================================
        // SEND REQUEST TO PYTHON
        // =================================================

        const response = await fetch("/search", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                video_url: videoUrl,

                search_word: searchWord

            })

        });


        console.log(
            "[COMFINDR] Response status:",
            response.status
        );


        // =================================================
        // READ RESPONSE
        // =================================================

        const data = await response.json();


        console.log(
            "[COMFINDR] Response received:",
            data
        );


        // =================================================
        // ERROR
        // =================================================

        if (!response.ok || data.success === false) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );

        }


        // =================================================
        // RESULTS
        // =================================================

        const comments =
            Array.isArray(data.comments)
                ? data.comments
                : [];


        const scanned =
            Number(data.scanned) || 0;


        const found =
            Number(data.found) || comments.length;


        // =================================================
        // NO MATCHING COMMENTS
        // =================================================

        if (found === 0) {

            resultsBox.innerHTML = `

                <div class="placeholder">

                    No matching comments found.

                    <br><br>

                    Scanned:
                    ${scanned}
                    comments.

                </div>

            `;

            return;

        }


        // =================================================
        // CLEAR RESULTS AREA
        // =================================================

        resultsBox.innerHTML = "";


        // =================================================
        // RESULT COUNT
        // =================================================

        const count =
            document.createElement("div");


        count.className = "success";


        count.textContent =
            `${found} matching comment(s) found`;


        resultsBox.appendChild(count);


        // =================================================
        // DISPLAY COMMENTS
        // =================================================

        comments.forEach(function (comment) {

            const commentElement =
                document.createElement("div");


            commentElement.className =
                "comment";


            commentElement.textContent =
                comment;


            resultsBox.appendChild(
                commentElement
            );

        });


        // =================================================
        // SCAN INFORMATION
        // =================================================

        const progress =
            document.createElement("div");


        progress.className =
            "scan-progress";


        progress.textContent =
            `Search complete | Scanned: ${scanned} | Found: ${found}`;


        resultsBox.appendChild(
            progress
        );


        // =================================================
        // SCROLL TO TOP
        // =================================================

        resultsBox.scrollTop = 0;

    }


    // =====================================================
    // ERROR
    // =====================================================

    catch (error) {

        console.error(
            "[COMFINDR ERROR]",
            error
        );


        resultsBox.innerHTML = `

            <div class="error">

                ${escapeHtml(
                    error.message ||
                    "Something went wrong."
                )}

            </div>

        `;

    }


    // =====================================================
    // ENABLE BUTTON
    // =====================================================

    finally {

        searchButton.disabled = false;

        searchButton.innerText = "Search";

    }

});


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(text) {

    const div =
        document.createElement("div");


    div.textContent =
        String(text);


    return div.innerHTML;

}
