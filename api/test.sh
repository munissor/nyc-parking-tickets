curl -X POST --header "Content-Type: application/json" -d '{"name": "test"}' http://localhost:3000/api/county
curl -X PUT --header "Content-Type: application/json" -d '{"name": "test2"}' http://localhost:3000/api/county/1
curl -X PATCH --header "Content-Type: application/json" -d '{"name": "test4"}' http://localhost:3000/api/county/1
curl -X GET http://localhost:3000/api/county/1
curl -X DELETE http://localhost:3000/api/county/1


curl -X POST --header "Content-Type: application/json" -d '{"number": "test", "registration_state": "NJ", "plate_type": "COM"}' http://localhost:3000/api/plate


curl -X POST --header "Content-Type: application/json" -d '{"registration_state": "TT", "plate_number":"tttttt","plate_type":"ttt","summons_number":"123123123","issue_date":"08/04/2013","violation_code":46,"vehicle_body_type":"SUBN","vehicle_make":"AUDI","issuing_agency":"P","street_code_1":37250,"street_code_2":13610,"street_code_3":21190,"vehicle_expiration_date":"20140831","violation_location":"0033","violation_precinct":"33","issuer_precinct":"33","issuer_code":"921043","issuer_command":"0033","issuer_squad":"0000","violation_time":"0752A","time_first_observed":null,"violation_in_front_or_opposit":"F","house_number":"712","street_name":"COM","date_first_observed":null,"law_section":"408","law_sub_division":"F1","violation_legal_code":"","days_parking_in_effect":null,"from_hours_in_effect":"ALL","to_hours_in_effect":"ALL","vehicle_color":"GY","vehicle_unregistered":null,"vehicle_year":2013,"meter_number":null,"feet_from_curb":"0","violation_post_code":null,"violation_description":"","violation_no_standing_or_stopping":null,"violation_hydrant":null,"violation_double_parking":null}' http://localhost:3000/api/ticket
