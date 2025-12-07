async function fetchUsers() {
    const date = document.getElementById("dateInput").value;
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

        const users = data?.users || [];
        const count = data?.count || 0;

        document.getElementById("userCount").innerText = count;

        if (users.length === 0) {
            document.getElementById("message").innerText = "No users found for this date.";
            return;
        }

        users.forEach(u => {
            const timestamp = u?.dateCreated;
            let formattedDate = "N/A";

            if (timestamp && timestamp.seconds) {
                const d = new Date(timestamp.seconds * 1000);
                formattedDate = d.toLocaleString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
            }

            const row = `
                <tr>
                    <td>${u?.userId || "N/A"}</td>
                    <td>${(u?.firstName || "") + " " + (u?.lastName || "")}</td>
                    <td>${u?.city || "N/A"}</td>
                    <td>${formattedDate}</td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });

    } catch (err) {
        loader.classList.add("hidden");
        console.error(err);
        alert("Something went wrong! Check console logs.");
    }
}
