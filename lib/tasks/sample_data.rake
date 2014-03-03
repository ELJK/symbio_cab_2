
namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do

    admin = User.create!(name: "System",
                         surname: "Admin",
                         gender: "Male",
                         dob: "2009-01-01",
                         email: "example@railstutorial.org",
                         tel: "+77017775511",
                         password: "foobar",
                         password_confirmation: "foobar",
                         admin: true)

    admin.treatments.create!(dname: "Asd",
                            dsurname: "Dsa",
                            dclinic: "qwe",
                            tprog: "Стандарт - Взрослые",
                            tdate: "2014-01-01")

    99.times do |n|
      name  = Faker::Name.first_name
      surname = Faker::Name.last_name
      email = "example-#{n+1}@railstutorial.org"
      clinic = Faker::Company.name
      password  = "password"

      user = User.create!(name: name,
                   surname: surname,
                   gender: "Male",
                   dob: rand(30.years).ago,
                   email: email,
                   tel: "+77017775511",
                   password: password,
                   password_confirmation: password)

      user.treatments.create!(dname: "Asd",
                               dsurname: "Dsa",
                               dclinic: clinic,
                               tprog: "Стандарт - Взрослые",
                               tdate: rand(1.year).ago)

    end
  end
end