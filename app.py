from flask import Flask, render_template, request, jsonify
from youtube_comment_downloader import YoutubeCommentDownloader

app = Flask(__name__)


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return render_template("index.html")


# =========================================================
# SEARCH
# =========================================================

@app.route("/search", methods=["POST"])
def search():

    print("\n==========================================", flush=True)
    print("COMFINDR", flush=True)
    print("SEARCH STARTED", flush=True)
    print("==========================================", flush=True)

    try:

        # -------------------------------------------------
        # GET DATA FROM WEBSITE
        # -------------------------------------------------

        data = request.get_json()

        video_url = data.get("video_url", "").strip()
        search_word = data.get("search_word", "").strip().lower()


        # -------------------------------------------------
        # CHECK INPUT
        # -------------------------------------------------

        if not video_url:

            return jsonify({
                "success": False,
                "error": "Please enter the YouTube video URL."
            }), 400


        if not search_word:

            return jsonify({
                "success": False,
                "error": "Please enter the word to search."
            }), 400


        print("Video URL:", video_url, flush=True)
        print("Search word:", search_word, flush=True)

        print("\nFetching comments...", flush=True)


        # =================================================
        # THIS IS THE SAME METHOD AS YOUR WORKING CODE
        # =================================================

        downloader = YoutubeCommentDownloader()

        comments = []


        # -------------------------------------------------
        # GET COMMENTS
        # -------------------------------------------------

        for comment in downloader.get_comments_from_url(
            video_url,
            sort_by=0
        ):

            comments.append(
                comment["text"]
            )


        print(
            f"\nFinished fetching {len(comments)} comments.",
            flush=True
        )


        # =================================================
        # FILTER MATCHING COMMENTS
        # =================================================

        print(
            f"\nComments that contain the word "
            f"'{search_word}':\n",
            flush=True
        )


        matching_comments = []


        for comment in comments:

            if search_word in comment.lower():

                matching_comments.append(
                    comment
                )

                print(
                    "-" + comment,
                    flush=True
                )


        # =================================================
        # NO RESULTS
        # =================================================

        if not matching_comments:

            print(
                "No matching comments found.",
                flush=True
            )


        # =================================================
        # SEND RESULTS TO WEBSITE
        # =================================================

        print(
            f"\nFound {len(matching_comments)} matching comments.",
            flush=True
        )

        print(
            "SEARCH FINISHED",
            flush=True
        )

        print(
            "==========================================\n",
            flush=True
        )


        return jsonify({

            "success": True,

            "comments": matching_comments,

            "scanned": len(comments),

            "found": len(matching_comments)

        })


    # =====================================================
    # ERROR
    # =====================================================

    except Exception as e:

        print(
            "\n==========================================",
            flush=True
        )

        print(
            "COMFINDR ERROR",
            flush=True
        )

        print(
            type(e).__name__,
            flush=True
        )

        print(
            str(e),
            flush=True
        )

        print(
            "==========================================\n",
            flush=True
        )


        return jsonify({

            "success": False,

            "error":
                f"{type(e).__name__}: {str(e)}"

        }), 500


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    print()
    print("==========================================")
    print("              COMFINDR")
    print("==========================================")
    print("Website:")
    print("http://127.0.0.1:5000")
    print("==========================================")
    print()


    app.run(

        host="127.0.0.1",

        port=5000,

        debug=False,

        threaded=True,

        use_reloader=False

    )