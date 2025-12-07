async function fetchUsers() {
    const date = document.getElementById("dateInput").value;
    const startTime = document.getElementById("startTime").value || "00:00";
    const endTime = document.getElementById("endTime").value || "23:59";

    if (!date) return alert("Please select a date!");

    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");

    const tableBody = document.querySelector("#usersTable tbody");
    tableBody.innerHTML = "";
    document.getElementById("message").innerText = "";

    try {
        const response = await fetch(
            `https://procounsellor-backend-1000407154647.asia-south1.run.app/api/dashboard/filterUsersByDate?date=${date}`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();
        loader.classList.add("hidden");

        let users = data?.users || [];

        const startDateTime = new Date(`${date}T${startTime}:00`).getTime();
        const endDateTime = new Date(`${date}T${endTime}:59`).getTime();

        users = users.filter(u => {
            if (!u?.dateCreated?.seconds) return false;
            const userTime = u.dateCreated.seconds * 1000;
            return userTime >= startDateTime && userTime <= endDateTime;
        });

        document.getElementById("userCount").innerText = users.length;

        if (users.length === 0) {
            document.getElementById("message").innerText = "No users found for this time range.";
            return;
        }

        users.forEach(u => {
            const states = Array.isArray(u?.userInterestedStateOfCounsellors)
                ? u.userInterestedStateOfCounsellors.join(", ")
                : "N/A";

            const row = `
                <tr>
                    <td>${u?.userId || "N/A"}</td>
                    <td>${u?.interestedCourse || "N/A"}</td>
                    <td>${states}</td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });

    } catch (err) {
        loader.classList.add("hidden");
        console.error(err);
        alert("Something went wrong!");
    }
}
