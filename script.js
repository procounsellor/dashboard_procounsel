const COURSE_ID = "a997f3a9-4a36-4395-9f90-847b739fb225"; // GuruCool Crash Course

function fetchEnrollments() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  if (!startDate || !endDate || !startTime || !endTime) {
    alert("Please select all date and time fields");
    return;
  }

  fetch("https://procounsellor-backend-1000407154647.asia-south1.run.app/api/dashboard/getCourseEnrollment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      courseId: COURSE_ID,
      startDate,
      endDate,
      startTime,
      endTime
    })
  })
  .then(async res => {
    const text = await res.text();

    if (!res.ok) {
      console.error("Server error:", text);
      throw new Error("Server returned error");
    }

    return JSON.parse(text);
  })
  .then(data => {
    document.getElementById("totalStudents").innerText = data.totalStudents;
    document.getElementById("rangeCount").innerText = data.count;

    const table = document.getElementById("resultTable");
    table.innerHTML = "";

    if (!data.enrollments || data.enrollments.length === 0) {
      table.innerHTML = "<tr><td colspan='2'>No enrollments found</td></tr>";
      return;
    }

    data.enrollments.forEach(e => {
      const enrolledAt = e.enrolledAt
        ? new Date(e.enrolledAt.seconds * 1000).toLocaleString()
        : "N/A";

      const row = `
        <tr>
          <td>${e.userId}</td>
          <td>${enrolledAt}</td>
        </tr>
      `;
      table.innerHTML += row;
    });
  })
  .catch(err => {
    alert("Failed to fetch enrollments. Check console for details.");
    console.error(err);
  });
}
