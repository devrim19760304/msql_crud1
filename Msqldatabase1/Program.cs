using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Data;



var builder = WebApplication.CreateBuilder(args);

//add cors
builder.Services.AddCors(options=> {
    options.AddPolicy("allowAll",policy=> {
        policy.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin();
    });

});

// Register EF Core with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();
//apply cors
app.UseCors("allowAll");

app.MapGet("/", () => "Hello World!");

//show all staff members 
app.MapGet("/showall",async (ApplicationDbContext db)=>
{
    var allStaff=await db.Staffs.ToListAsync();
    if (allStaff.Count==0) {
        return Results.Ok(new {Message="staff list is empty"});
    }
    return Results.Ok(allStaff);
}
);

//add new staff
app.MapPost("/addstaff",async(ApplicationDbContext db,[FromBody] Staff staff)=>{
var existedPerson=await db.Staffs.FindAsync(staff.Id);
if (existedPerson!=null )
{
    return Results.Ok(new {Message="this person already exists "});
}
db.Staffs.Add(staff);
await db.SaveChangesAsync();
return Results.Ok(new {Message=$"the person added  with name {staff.FirstName}"});
});

//update a staff member
app.MapPut("/updateperson/{id}",async(ApplicationDbContext db, int id,[FromBody] Staff updatedStaff)=> {
    var existedPerson=await db.Staffs.FindAsync(id);
    if (existedPerson==null)
    {
        return Results.NotFound("This person is not found");
    }
    existedPerson.FirstName=updatedStaff.FirstName ?? existedPerson.FirstName;
    existedPerson.LastName=updatedStaff.LastName; 
    existedPerson.Email=updatedStaff.Email;
    existedPerson.Gender=updatedStaff.Gender;
    existedPerson.Salary=updatedStaff.Salary;
    existedPerson.Location=updatedStaff.Location;
    existedPerson.Department=updatedStaff.Department;

    await db.SaveChangesAsync();
    return Results.Ok(existedPerson);


    
});

//delete method deleterequest
app.MapDelete("/deleteperson",async(ApplicationDbContext db,[FromBody] DeleteRequest deleteRequest)=> {

    var existedPerson=await db.Staffs.FindAsync(deleteRequest.DeleteId);
    if (existedPerson==null)
    {
        return Results.NotFound("This person is not found");
    }
    db.Staffs.Remove(existedPerson);
    await db.SaveChangesAsync();
    return Results.Ok(new {Message=$"person is deleted {existedPerson.FirstName}"});

});

//delete request direct body 
app.MapDelete("/deletepersonbody",async(ApplicationDbContext db,[FromBody] int deleteId)=> {

    var existedPerson=await db.Staffs.FindAsync(deleteId);
    if (existedPerson==null)
    {
        return Results.NotFound("This person is not found");
    }
    db.Staffs.Remove(existedPerson);
    await db.SaveChangesAsync();
    return Results.Ok(new {Message=$"person is deleted {existedPerson.FirstName}"});

});

//find a person by id 

app.MapPost("/findstaffbyid", async (ApplicationDbContext db, [FromBody] int id) =>
{
    var existedPerson = await db.Staffs.FindAsync(id);

    if (existedPerson == null)
        return Results.NotFound(new {message = $"Person with id {id} does not exist"});
    
    return Results.Ok(existedPerson);
});



// find by email
app.MapPost("/findstaffbyemail", async (ApplicationDbContext db, [FromBody] string email) =>
{
    var existedPerson = await db.Staffs.FirstOrDefaultAsync(s => s.Email == email);

    if (existedPerson == null)
        return Results.NotFound(new {message = $"Person with email {email} does not exist"});
    
    return Results.Ok(existedPerson);
});

app.Run();

public class DeleteRequest 
{
    public int DeleteId {get;set;}
};
