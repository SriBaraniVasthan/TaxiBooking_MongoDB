//new database connection
conn = new Mongo();
db = conn.getDB('taxidatabase');

//drop database if 'taxidatabase' already exists
db.dropDatabase();


// insert driver table
db.drivers.insertMany([{
    first_name: 'Tom',
    last_name: 'Jerry',
    date_of_birth: new Date('1999-01-01'),
    contact_details: {
        address: 'Regent Street, London',
        postcode: 'E15 4NU',
        contact_number: '+44 123 456 7890',
        email: 'tomjerry@gmail.com',
        emergency_contact:{
            name:"Bill",
            contact_number:"+44 123 789 4560"
        }
    },
    employment_record:{
        employment_role:"driver",
        employment_type:"permanent",
        start_date:new Date('2022-01-01'),
        end_date:null
    },
    wage:{
        wage_type:"fixed",
        salary:2000
    },
    disciplinary_records:null,
    last_update:new Date()
},{
    first_name: 'Tom',
    last_name: 'Riddle',
    date_of_birth: new Date('1990-01-01'),
    contact_details: {
        address: 'Oxford Street, London',
        postcode: 'E15 4NU',
        contact_number: '+44 789 456 7890',
        email: 'tomr@gmail.com',
        emergency_contact:{
            name:"Ford",
            contact_number:"+44 666 789 4560"
        }
    },
    employment_record:{
        employment_role:"driver",
        employment_type:"temporary",
        start_date:new Date('2015-01-01'),
        end_date:null
    },
    wage:{
        wage_type:"percentage of receipt",
        salary:20
    },
    disciplinary_records:null,
    last_update:new Date()
}]);

//insert car table
db.cars.insertMany([{
    registration_number: "BD51SMR",
    registration_date: new Date('2019-01-01'),
    model: "Toyota Yaris",
    car_type: "Sedan", 
    last_MOT_test: new Date('2021-01-01'),
    car_owner_details: { 
        name: "Orachimaru",
        address: "Low Road, N139NU",
        contact_number: '+44 123 456 7584',
        car_insurance: "0123 456 7890"
    },
    car_status: "roadworthy", //other options: in for service, awaiting repair, written off
    last_service_date:  new Date('2021-12-01'),
    last_update:new Date()
},{
    registration_number: "CE1SMS",
    registration_date: new Date('2014-01-01'),
    model: "Audi A6",
    car_type: "Sedan", 
    last_MOT_test: new Date('2022-01-01'),
    car_owner_details: { 
        name: "Naruto",
        address: "Eight Brothers Road, N149NU",
        contact_number: '+44 888 456 7584',
        car_insurance: "1245 456 7890"
    },
    car_status: "in service",
    last_service_date:  new Date('2022-12-01'),
    last_update:new Date()
}]);

//insert operators table
db.operators.insertMany([{
    first_name: 'Snow',
    last_name: 'Jo',
    date_of_birth: new Date('1998-01-01'),
    contact_details: {
        address: 'Oxford Street, London',
        postcode: 'W1D 2LG',
        contact_number: '+44 123 456 9875',
        email: 'snowjo2@gmail.com',
        emergency_contact:{
            name:"Jo Jo",
            contact_number:"+44 123 789 5420"
        }
    },
    employment_record:{
        employment_role:"operator",
        employment_type:"temporary",
        start_date:new Date('2022-09-01'),
        end_date:new Date('2023-02-01'),
    },
    disciplinary_records:null,
    last_update:new Date()
},{
    first_name: 'Daenerys',
    last_name: 'Targeryan',
    date_of_birth: new Date('1990-01-01'),
    contact_details: {
        address: 'Bond Street, London',
        postcode: 'W4 2LG',
        contact_number: '+44 565 456 9875',
        email: 'draco2@gmail.com',
        emergency_contact:{
            name:"Jaja",
            contact_number:"+44 999 789 5420"
        }
    },
    employment_record:{
        employment_role:"operator",
        employment_type:"part-time",
        start_date:new Date('2016-09-01'),
        end_date:new Date('2023-02-01')
    },
    disciplinary_records:null,
    last_update:new Date()
}]);


//get fields of driver for mapping id
driver_tom = db.drivers.findOne({first_name: "Tom"});
driver_riddle = db.drivers.findOne({last_name: "Riddle"});

//get fields of operator for mapping id
operator_snow = db.operators.findOne({first_name: "Snow"});
operator_daenerys = db.operators.findOne({first_name: "Daenerys"});
//get fields of car for mapping id
car_toyota = db.cars.findOne({registration_number: "BD51SMR"});

db.shift.insertMany([{
    _id:driver_tom._id,
    morning_shift: false,
    noon_shift:false,
    evening_shift:true,
    midnight_shift:true
},{
    _id:driver_riddle._id,
    morning_shift: false,
    noon_shift:false,
    evening_shift:true,
    midnight_shift:false
},{
    _id:operator_snow._id,
    morning_shift: true,
    noon_shift:false,
    evening_shift:false,
    midnight_shift:true
},{
    _id:operator_daenerys._id,
    morning_shift: true,
    noon_shift:false,
    evening_shift:true,
    midnight_shift:false
}])

//create booking table
db.bookings.insertMany([{
    booking_frequecy: "weekly", 
    booking_date: new Date('2022-12-08'),
    customer_details: { 
        customer_id : new ObjectId(),
        name: "Rose", 
        contact_number:"+44 123 789 9124",
        email: "rosejack@gmail.com",
        is_client_membership: true,
        membership_no: '001',//optional: if the customer is not a client then no membership_no field
    },
    passenger_count: 3,
    pickup_time: ISODate("2022-12-08T18:00:00"),
    pickp_location: "Mile End",
    dropoff_location: "Edmonton",
    special_requirements: "No air con",
    driver_id: driver_tom._id,
    operator_id: operator_snow._id,
    payment_id: new ObjectId(),
    car_id: car_toyota._id,
    last_update:new Date()
},{
    booking_frequecy: "once", 
    booking_date: new Date('2022-12-10'),
    customer_details: { 
        customer_id : new ObjectId(),
        name: "Jack", 
        contact_number:"+44 565 789 9124",
        email: "jack@gmail.com",
        is_client_membership: false,
    },
    passenger_count: 1,
    pickup_time: ISODate("2022-12-11T18:00:00"),
    pickp_location: "Liverpool Street",
    dropoff_location: "Aldgate",
    special_requirements: null,
    driver_id: driver_tom._id,
    operator_id: operator_snow._id,
    payment_id: new ObjectId(),
    car_id: car_toyota._id,
    last_update:new Date()
}]);

//get fields of payment for mapping id
payer_rose = db.bookings.findOne({"customer_details.name":"Rose"})
payer_jack = db.bookings.findOne({"customer_details.name":"Jack"})

//create paymentstable
db.payments.insertMany([{
    _id:payer_rose.payment_id,
    payee_name: "Rose",
    payment_method: "card", 
    payment_date: new Date('2022-12-08'),
    price: 50,
    last_update:new Date()
},{
    _id:payer_jack.payment_id,
    payee_name: "Jack",
    payment_method: "cash", 
    payment_date: new Date('2022-12-10'),
    price: 30,
    last_update:new Date()
}]);

//get fields of bookings for mapping id
client_Rose = db.bookings.findOne({"customer_details.name":"Rose"})

//create clients table
db.clients.insertOne({
    membership_no:'001',
    client_type: "private",
    is_active: true, 
    membership_start_date: new Date('2022-11-08'),
    membership_end_date: new Date('2023-11-08'),
    booking_frequecy: 'weekly',
    last_update:new Date()
});

//create revenue table
db.revenues.insertMany([{
    driver_id:driver_tom._id,
    money_earned:200,
    expenditure:{
        driver_wage: 140,
        car_maintanence:10,
        operator_salary:20,
        company_cost:20,
        electricity:10
    },
    last_update:new Date()
},{
    driver_id:driver_riddle._id,
    money_earned:200,
    expenditure:{
        driver_wage: 130,
        car_maintanence:20,
        operator_salary:20,
        company_cost:20,
        electricity:10
    },
    last_update:new Date()
}])


