from flask import render_template


def register_routes(app):
    @app.get("/")
    @app.get("/results")
    def results():
        return render_template("results.html")

    @app.get("/hotels/<hotel_id>")
    def hotel_details(hotel_id):
        return render_template("hotel_details.html", hotel_id=hotel_id)

    @app.get("/book/<hotel_id>/room")
    def booking_room(hotel_id):
        return render_template("booking_room.html", hotel_id=hotel_id, step=1)

    @app.get("/book/<hotel_id>/guest")
    def booking_guest(hotel_id):
        return render_template("booking_guest.html", hotel_id=hotel_id, step=2)

    @app.get("/book/<hotel_id>/payment")
    def booking_payment(hotel_id):
        return render_template("booking_payment.html", hotel_id=hotel_id, step=3)

    @app.get("/confirmation")
    def confirmation():
        return render_template("confirmation.html")
