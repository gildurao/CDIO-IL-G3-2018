:- use_module(library(http/thread_httpd)). % Needed to process HTTP Requests with the use of threads
:- use_module(library(http/http_dispatch)). % Needed to dispatch HTTP Requests
:- use_module(library(http/http_parameters)). % Needed to process HTTP Requests Parameteres
:- use_module(library(http/json)). % Need to process JSON Objects
:- use_module(library(http/json_convert)). % Need to convert JSON Objects in JSON strings
:- use_module(library(http/http_json)). % % Need to process JSON Objects in HTTP predicates
:- use_module(library(http/http_error)). % Needed for stack traces (Thanks to Jan for the tip)

:- http_handler('/mycl/api/algorithms',display_available_algorithms,[]). % Endpoint to display all algorithms available
:- http_handler('/mycl/api/travel',compute_algorithm,[time_limit(0)]). % Endpoint to compute a city circuit
:- http_handler('/mycl/api/factories',shortest_factory,[time_limit(0)]). % Endpoint to compute the shortest factory
:- http_handler('/mycl/api/packing',bin_packing,[time_limit(0)]). % Endpoint to compute the bin packing
:- http_handler('/mycl/api/delivery',delivery_plan,[time_limit(0)]). %Endpoint to compute a delivery plan 


% Loads required knowledge bases
carregar:-['intersept.pl'],['cdio-tsp.pl'],['parameters.pl'],load_computations,load_algorithms,load_json_objects.

% Loads required defined json objects
load_json_objects:-['json_algorithms.pl'].

% Loads required algorithms
load_algorithms:- ['algorithms/branch_and_bound.pl'],['algorithms/greedy.pl'],['algorithms/2opt.pl'],['algorithms/genetics.pl'],load_bin_packing_algorithms,load_delivery_plan.

% Loads computation predicates
load_computations:- ['algorithm_computation.pl'],['location_computation.pl'].

load_bin_packing_algorithms:- ['algorithms/binpacking/guillotine_packing.pl'],['algorithms/binpacking/simulated_annealing.pl'].

load_delivery_plan:-['algorithms/DeliveryPlan.pl'],['algorithms/tsp/cdio-tsp.pl','algorithms/tsp/intersept.pl','algorithms/tsp/parameters.pl'],['algorithms/tsp/branch_and_bound.pl'],['algorithms/tsp/greedy.pl'],['algorithms/tsp/2opt.pl'],['algorithms/tsp/genetics.pl'],['algorithms/packing/guillotine_packing.pl'],['algorithms/packing/simulated_annealing.pl'].

% Starts the server
server(Port) :-						% (2)
        http_server(http_dispatch, [port(Port)]).



% Displays all algorithm available
display_available_algorithms(_Request):-
        format('Content-type: application/json'),
        get_available_algorithms(Alg),
        prolog_to_json(Alg,AlgJSON),
        reply_json(AlgJSON).


% Computes a city circuit with a provided algorithm (W/Initial City)
compute_algorithm(Request):-
        http_read_json(Request, JSONIn,[json_object(city_circuit_body_request)]),
        json_to_prolog(JSONIn, CC),
        CC=city_circuit_body_request(Id,C,L),
        json_cities_to_cities([C],[InitialCity]),
        json_cities_to_cities(L,Cities),
        compute_algorithm(Id,InitialCity,Cities,CitiesToTravel,Distance),
        cities_to_json_cities(CitiesToTravel,JSONCitiesToTravel),
        DistanceJSON=distance_object(Distance,'KM'),
        prolog_to_json(cities_body_response(Id,JSONCitiesToTravel,DistanceJSON),RSP),
        format(user_output,"Request is: ~p~n",[JSONCitiesToTravel]),
        reply_json(RSP),
        !.

% Computes a city circuit with a provided algorithm (List Only)
%compute_algorithm(Request):-
%        http_read_json(Request, JSONIn,[json_object(cities_body_request)]),
%        json_to_prolog(JSONIn, CC),
%        CC=cities_body_request(Id,L),
%        json_cities_to_cities(L,Cities),
%        [OriginalCity|CircuitCities]=Cities,
%        compute_algorithm(Id,OriginalCity,CircuitCities,CitiesToTravel,Distance),
%        cities_to_json_cities(CitiesToTravel,JSONCitiesToTravel),
%        DistanceJSON=distance_object(Distance,'KM'),
%        prolog_to_json(cities_body_response(Id,JSONCitiesToTravel,DistanceJSON),RSP),
%        format(user_output,"Request is: ~p~n",[JSONCitiesToTravel]),
%        reply_json(RSP),
%        !.


% Replies with 404 not found if the algorithm being applied the computation doesnt exist
compute_algorithm(_Request):-
        prolog_to_json(message_object("No such algorithm found"),Message),
        reply_json(Message,[status(404)]).

shortest_factory(Request):-
        http_read_json(Request, JSONIn,[json_object(factories_body_request)]),
        json_to_prolog(JSONIn, FF),
        FF=factories_body_request(JCity,JFactories),
        json_cities_to_cities([JCity],[City]),
        json_cities_to_cities(JFactories,Factories),
        compute_shortest_city(City,Factories,(ShortestFactory,Distance)),
        city_to_city_json_object(ShortestFactory,JShortestFactory),
        JDistance=distance_object(Distance,'KM'),
        prolog_to_json(factories_body_response(JShortestFactory,JDistance),SFJ),
        reply_json(SFJ).



% ######### BIN PACKING REQUEST ############


% Processes the bin packing algorithm computation request
bin_packing(Request):-
        http_read_json(Request,JSONIn,[json_object(bin_packing_request)]),
        json_to_prolog(JSONIn,BPR),
        BPR=bin_packing_request(_,ContainerObject,PackageObjectsList),
        ContainerObject=container_object(CWidth,CHeight,CDepth,CWeight),
        json_packages_packages_tuples(PackageObjectsList,Packages),
        compute_algorithm(5,(CWidth,CHeight,CDepth,CWeight),Packages,Packed,OccupationPercentage),
        package_tuples_to_json_packages(Packed,PackedJO),
        prolog_to_json(bin_packing_response(OccupationPercentage,ContainerObject,PackedJO),BPRS),
        reply_json(BPRS),
        !.


% Replies 400 Bad Request if an error occurs while processing the request
bin_packing(_Request):-
        prolog_to_json(message_object("An error occurd while processing the algorithm"),Message),
        reply_json(Message,[status(400)]).




% ############ DELIVERY PLAN ############


% Processes the delivery plan computation request
delivery_plan(Request):-
        http_read_json(Request,JSONIn,[json_object(delivery_plan_request)]),
        json_to_prolog(JSONIn,DPR),
        DPR=delivery_plan_request(CitiesToTravel,ProductionFactory,Orders,Trucks),
        json_cities_to_tuples(CitiesToTravel,CitiesToTravelTuples),
        delivery_plan_production_factory_request(FId,FName,FLatitude,FLongitude,FCityId)=ProductionFactory,
        json_orders_to_tuples(Orders,OrdersTuples),
        json_trucks_to_tuples(Trucks,TrucksTuples),
        compute_delivery_plan(1,CitiesToTravelTuples,(FId,FName,FLatitude,FLongitude,FCityId),OrdersTuples,TrucksTuples,TravelPlan,TrucksPlan),
        truck_route_to_json_object(TravelPlan,TravelPlanJSON),
        truck_fill_to_json_object(TrucksPlan,TrucksPlanJSON),
        prolog_to_json(delivery_plan_response(TrucksPlanJSON,TravelPlanJSON),DPRS),
        reply_json(DPRS),
        !.


% Replies 400 Bad Request if an error occurs while processing the request
delivery_plan(_Request):-
        prolog_to_json(message_object("An error occurd while processing the algorithm"),Message),
        reply_json(Message,[status(400)]).




% Checks the query parameters that can be extracted from the available algorithms URI
check_available_algorithms_query_parameters(Request,Id):-
        http_parameters(Request, [
                id(Id, [ optional(true) ])
        ]).

% Parses a list of json_object as cities to a city facts
json_cities_to_cities([],[]).
json_cities_to_cities([H|T],Cities):-
        json_to_prolog(H,H1),
        H1=city_object(N,LT,LO),
        json_cities_to_cities(T,Cities1),
        append([city(N,LT,LO)],Cities1,Cities).

% Parses a list of city facts as json_object cities
cities_to_json_cities([],[]).
cities_to_json_cities([H|T],JSONCities):-
        cities_to_json_cities(T,JSONCities1),
        append([basic_city_object(H)],JSONCities1,JSONCities).

% Parses a city fact into a json city object
city_to_city_json_object(city(Name,LT,LO),city_object(Name,LT,LO)).


% Parses a list of package json objects into a list of package tuples
json_packages_packages_tuples([],[]):-!.

json_packages_packages_tuples([H|T],LPT):-
        H=package_object(PID,PW,PH,PD,PPID,PWE),
        json_packages_packages_tuples(T,LPT1),
        append([(PID,PW,PH,PD,PWE,PPID)],LPT1,LPT).

% Parses a list of package tuples into a list of package json objects
package_tuples_to_json_packages([],[]):-!.

package_tuples_to_json_packages([(ID,PW,PH,PD,PPD,PPI)|T],LPJ):-
        package_tuples_to_json_packages(T,LPJ1),
        append([package_response_object(ID,PW,PH,PD,PPI,PPD)],LPJ1,LPJ).







% Parses a list of json city objects into a list of city tuples
json_cities_to_tuples([],[]):-!.

json_cities_to_tuples([H|T],TuplesCities):-
        json_cities_to_tuples(T,TuplesCities1),
        delivery_plan_truck_route_response(Id,Name,Latitude,Longitude)=H,
        append([(Id,Name,Latitude,Longitude)],TuplesCities1,TuplesCities).


% Parses a list of json orders objects into a list of order tuples
json_orders_to_tuples([],[]):-!.

json_orders_to_tuples([H|T],TuplesOrders):-
        json_orders_to_tuples(T,TuplesOrders1),
        delivery_plan_order_request(Id,Packages,CityId,DeliveryDate)=H,
        json_packages_to_tuples(Packages,PackagesTuples),
        append([(Id,PackagesTuples,CityId,DeliveryDate)],TuplesOrders1,TuplesOrders).


% Parses a list of json packages objects into a list of packages tuples
json_packages_to_tuples([],[]):-!.

json_packages_to_tuples([H|T],TuplesPackages):-
        json_packages_to_tuples(T,TuplesPackages1),
        delivery_plan_truck_request(Id,Width,Height,Depth,Weight)=H,
        append([(Id,Width,Height,Depth,Weight)],TuplesPackages1,TuplesPackages).



% Parses a list of json trucks objects into a list of trucks tuples
json_trucks_to_tuples([],[]):-!.

json_trucks_to_tuples([H|T],TuplesTrucks):-
        json_trucks_to_tuples(T,TuplesTrucks1),
        delivery_plan_truck_request(Id,Width,Height,Depth,Weight)=H,
        append([(Id,Width,Height,Depth,Weight)],TuplesTrucks1,TuplesTrucks).
        %append([(Width,Height,Depth,Weight)],TuplesTrucks1,TuplesTrucks).




truck_fill_to_json_object([],[]):-!.

truck_fill_to_json_object([H|T],TruckFillJSONObject):-
        (Id,Width,Depth,Height,Weight,MaxOccupation,ExpeditionDate,Packages)=H,
        package_to_json_object(Packages,PackagesJSONObjects),
        truck_fill_to_json_object(T,TruckFillJSONObject1),
        append([delivery_plan_truck_response(Id,Width,Depth,Height,Weight,MaxOccupation,ExpeditionDate,PackagesJSONObjects)],TruckFillJSONObject1,TruckFillJSONObject).



truck_route_to_json_object([],[]):-!.

truck_route_to_json_object([H|T],TruckRouteJSONObject):-
        (Id,Name,Latitude,Longitude)=H,
        truck_route_to_json_object(T,TruckRouteJSONObject1),
        append([delivery_plan_truck_route_response(Id,Name,Latitude,Longitude)],TruckRouteJSONObject1,TruckRouteJSONObject).


package_to_json_object([],[]):-!.

package_to_json_object([H|T],PackagesJSONObjects):-
        (Id,X,Y,Z)=H,
        package_to_json_object(T,PackagesJSONObjects1),
        append([delivery_plan_package_response(Id,X,Y,Z)],PackagesJSONObjects1,PackagesJSONObjects).