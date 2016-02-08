(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('IncidentService', IncidentService)

  IncidentService.$inject = [ '$http', '$rootScope', 'shamanConfiguration', 'UtilsService', 'SettingsService', 'ClientsService'];
  /* jshint ignore:start */
  function IncidentService($http, $rootScope, shamanConfiguration, UtilsService, SettingsService, ClientsService) {

    function getAll() {
      return $http.get(shamanConfiguration.url + 'api/incidents/GetAll');
    }

    function getByPhone(phone) {
      return $http.get(shamanConfiguration.url + 'api/incidents/GetByPhone?phone=' + phone);
    }

    function validateLocality(locality) {
      return $http.get(shamanConfiguration.url + 'api/localities/GetLocalityByAbreviaturaId?locAbreviaturaId=' + locality);
    }

    function getNewIncidentNumberToCreate() {
      return $http.get(shamanConfiguration.url + 'api/incidents/GetNewIncidentNumberToCreate');
    }

    function setIncident(incident) {
      service.incident.age                          = incident.edad;
      service.incident.number                       = incident.nroIncidente;
      service.incident.affiliateNumber              = incident.nroAfiliado;
      service.incident.client                       = incident.cliente.abreviaturaId;
      service.incident.advertise                    = incident.aviso;
      service.incident.incDate                      = moment(incident.fechaIncidente).format("DD/MM/YYYY");
      service.incident.patient                      = incident.paciente;
      service.incident.phoneNumber                  = incident.telefono;
      service.incident.locAbreviature               = incident.localidad.abreviaturaId;
      service.incident.locality                     = incident.localidad.descripcion;
      service.incident.partido                      = incident.localidad.partido.descripcion;
      service.incident.domicile                     = {};
      service.incident.domicile.street              = incident.domicilio.street;
      service.incident.domicile.height              = incident.domicilio.height;
      service.incident.domicile.floor               = incident.domicilio.floor;
      service.incident.domicile.department          = incident.domicilio.department;
      service.incident.domicile.betweenFirstStreet  = incident.domicilio.betweenStreet1;
      service.incident.domicile.betweenSecondStreet = incident.domicilio.betweenStreet2;
      service.incident.symptoms                     = incident.sintomas;

      if (incident.gradoOperativo) {
      service.incident.operativeGradeSelected       = UtilsService.getObjectByPropertyInArray(SettingsService.operativeGradeOptions, 'label', incident.gradoOperativo.descripcion);
      }
      
      service.incident.sexSelected                  = UtilsService.getObjectByPropertyInArray(SettingsService.sexOptions, 'label', incident.sexo);
      service.incident.ivaSituationSelected         = UtilsService.getObjectByPropertyInArray(SettingsService.ivaSituationsOptions, 'id', incident.cliente.situacionIvaId.id );

      if (incident.planId && incident.cliente.abreviaturaId) {
        ClientsService.getPlansByClient(incident.cliente.abreviaturaId)
        .then(function(response){
          ClientsService.setPlans(response.data);
          service.incident.planSelected = UtilsService.getObjectByPropertyInArray(ClientsService.planOptions, 'label', incident.planId);
        })
      }
    }

    function getIncidentById(id) {
      return $http.get(shamanConfiguration.url + 'api/incidents/getById?id=' + id);
    }

    var service = {
      incident                     : {},
      getAll                       : getAll,
      getByPhone                   : getByPhone,
      validateLocality             : validateLocality,
      getNewIncidentNumberToCreate : getNewIncidentNumberToCreate,
      setIncident                  : setIncident,
      getIncidentById              : getIncidentById
    };

    return service;

  }

})();
