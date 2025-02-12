let allPeople=[];

    async function getAll() {
        ;
        const url = "http://localhost:5146/showall";
        try {
            const response = await fetch(url, { method: "GET" });
            if (!response.ok) throw new Error("Error with fetch");

            const data = await response.json();
            allPeople.length = 0; // Clear array before populating to avoid duplicates
            allPeople.push(...data);
            console.log(data);
        } catch (error) {
            console.error("error", error);
        }
        //create table function 
        createTable()
    }

    async function createFromAPI() {
        await getAll(); // Ensure database check is completed first

        if (allPeople.length > 0) {
            alert("It is already populated");
            return;
        }

       

        const url = "https://randomuser.me/api/?results=10";
        const departments = [
            "Human Resources", "Finance", "Marketing", "Sales", "IT Support",
            "Product Development", "Customer Service", "Logistics", "Legal", "Research & Development"
        ];

        try {
            const response = await fetch(url, { method: "GET" });
            if (!response.ok) throw new Error("Error fetching API data");

            const data = await response.json();
            const rawData = data.results;

            for (const p of rawData) {
                let newPerson = {
                    FirstName: p.name.first,
                    LastName: p.name.last,
                    Gender: p.gender,
                    Email: p.email,
                    Department: departments[Math.floor(Math.random() * departments.length)],
                    Salary: Math.floor(Math.random() * 10000) + 20000,
                    Location: p.location.city
                };
                await createPersonFromApi(newPerson); // Ensure each entry is added properly
            }
            
            alert("Database successfully populated from API");

        } catch (error) {
            console.error("error", error);
        }
    }

    async function createPersonFromApi(samplestaff) {
        const url = "http://localhost:5146/addstaff";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(samplestaff)
            });

            if (!response.ok) throw new Error("Error posting data");

            const data = await response.json();
            console.log("Added:", data);
        } catch (error) {
            console.error("error", error);
        }
    }


    //create table 
    // Create table and modal close functionality
    async function createTable() {
        console.log("---------- Creating table", allPeople);
        
        // Get modal container
        let tableModalDialog = document.getElementById("table-modal-dialog");

        // Ensure the modal exists
        if (!tableModalDialog) {
            console.error("Modal dialog element not found!");
            return;
        }

        // Remove any existing table to avoid duplication
        let existingTable = document.getElementById("staffTable");
        if (existingTable) {
            existingTable.remove();
        }

        // Create table
        let staffTable = document.createElement("table");
        staffTable.id = "staffTable"; // Assign an ID for reference

        // Create table header
        let staffTableHeader = document.createElement("thead");
        staffTableHeader.innerHTML = `
            <tr> 
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Location</th>    
            </tr>    
        `;
        staffTable.appendChild(staffTableHeader);

        // Create table body
        let staffTableBody = document.createElement("tbody");

        // Populate table rows with `allPeople` data
        allPeople.forEach((person) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${person.id}</td>
                <td>${person.firstName}</td>
                <td>${person.lastName}</td>
                <td>${person.gender}</td>
                <td>${person.email}</td>
                <td>${person.department}</td>
                <td>${person.salary}</td>
                <td>${person.location}</td>
            `;
            staffTableBody.appendChild(row);
        });

        staffTable.appendChild(staffTableBody);

        // Append table inside modal
        tableModalDialog.innerHTML = ""; // Clear previous content to avoid duplication
        tableModalDialog.style.backgroundColor="powderblue";
        tableModalDialog.appendChild(staffTable);

        // Create "Close" button only if it does not exist
        let existingCloseButton = document.getElementById("modal-button");
        if (!existingCloseButton) {
            let modalButton = document.createElement("button");
            modalButton.id = "modal-button";
            modalButton.innerText = "Close";

            // Add event listener to close modal
            modalButton.addEventListener("click", function () {
                tableModalDialog.close(); // Close modal on button click
            });

            tableModalDialog.appendChild(modalButton);
            modalButton.style.marginTop="20px";
            modalButton.style.width="140px";
            modalButton.style.display="block";
            
        }

        // Show the modal
        tableModalDialog.showModal();
    }
    


