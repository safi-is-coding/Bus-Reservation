exports.generateEmailTemplate = (username, busDetails) => `
    <!DOCTYPE html>
    <html>
    <body>
        <h1>Booking Confirmation</h1>
        <p>Dear ${username},</p>
        <p>Your bus reservation is confirmed with the following details:</p>
        <ul>
            <li>Bus Number: ${busDetails.busNumber}</li>
            <li>Departure: ${busDetails.departure}</li>
            <li>Destination: ${busDetails.destination}</li>
            <li>Seats Booked: ${busDetails.seatsBooked}</li>
        </ul>
    </body>
    </html>
`;
