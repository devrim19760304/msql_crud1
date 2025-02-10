
using System.ComponentModel.DataAnnotations;

public class Staff 
{
    [Key]
    public int Id {get;set;}=0;
    [Required]
    public string FirstName {get;set;}="";
    [Required]
    public string LastName {get;set;}="";
    public string Gender {get;set;}="u";
    public string Email {get;set;}="";
    public string Department {get;set;}="";

    public double Salary {get;set;}=0;

    public string Location {get;set;}="";



}