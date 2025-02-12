let allPeople=[];

    async function getAll() {
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