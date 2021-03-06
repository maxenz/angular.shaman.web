(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('IncidentService', IncidentService)

  IncidentService.$inject = [ '$http', '$rootScope', 'shamanConfiguration', 'UtilsService', 'SettingsService', 'ClientsService',
  '$log'];
  /* jshint ignore:start */
  function IncidentService($http, $rootScope, shamanConfiguration, UtilsService, SettingsService, ClientsService, $log) {

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

    function setIncident(data) {
      var incident                                  = UtilsService.toCamel(data);
      service.incident.id                           = incident.id;
      service.incident.age                          = incident.edad;
      if (incident.nroIncidente) {
        service.incident.number                       = incident.nroIncidente;
      }
      
      service.incident.affiliateNumber              = incident.nroAfiliado;
      service.incident.client                       = incident.abreviaturaId;
      service.incident.advertise                    = incident.aviso;
      service.incident.incDate                      = moment(incident.fechaIncidente).format("DD/MM/YYYY");
      service.incident.patient                      = incident.paciente;
      service.incident.phoneNumber                  = incident.telefono;
      if (incident.localidad) {
        service.incident.locAbreviature               = incident.localidad.abreviaturaId;
        service.incident.locality                     = incident.localidad.descripcion;
        service.incident.partido                      = incident.localidad.partido.descripcion;
      }

      if (incident.domicilio) {
        service.incident.domicile                     = {};
        service.incident.domicile.street              = incident.domicilio.street;
        service.incident.domicile.height              = incident.domicilio.height;
        service.incident.domicile.floor               = incident.domicilio.floor;
        service.incident.domicile.department          = incident.domicilio.department;
        service.incident.domicile.betweenFirstStreet  = incident.domicilio.betweenStreet1;
        service.incident.domicile.betweenSecondStreet = incident.domicilio.betweenStreet2;
        service.incident.domicile.reference           = incident.domicilio.reference;
      }

      service.incident.symptoms                     = incident.sintomas;
      service.incident.observations                 = incident.observaciones;
      service.incident.copayment                    = incident.copago;
      if(incident.diagnostico) {
        service.incident.diagnosis = incident.diagnostico.descripcion;
      }

      service.incident.patientDerivative            = incident.derivacion;

      if (incident.gradoOperativo) {
        service.incident.operativeGradeSelected     = UtilsService.getObjectByPropertyInArray(SettingsService.operativeGradeOptions, 'label', incident.gradoOperativo.descripcion);
      }

      service.incident.sexSelected                  = UtilsService.getObjectByPropertyInArray(SettingsService.sexOptions, 'label', incident.sexo);
      service.incident.ivaSituationSelected         = UtilsService.getObjectByPropertyInArray(SettingsService.ivaSituationsOptions, 'id', incident.situacionIvaId );

      if (incident.abreviaturaId) {
        ClientsService.getPlansByClient(incident.abreviaturaId)
        .then(function(response){
          ClientsService.setPlans(response.data);
          if (incident.planId) {
            service.incident.planSelected = UtilsService.getObjectByPropertyInArray(ClientsService.planOptions, 'id', parseInt(incident.planId));
          }
        })
      }
    }

    function getIncidentById(id) {
      return $http.get(shamanConfiguration.url + 'api/incidents/getById?id=' + id);
    }

    function getLast() {
      return $http.get(shamanConfiguration.url + 'api/incidents/getLast');
    }

    function getPrevious(id) {
      return $http.get(shamanConfiguration.url + 'api/incidents/getPrevious?id=' + id);
    }

    function getNext(id) {
      return $http.get(shamanConfiguration.url + 'api/incidents/getNext?id=' + id);
    }

    function getFirst() {
      return $http.get(shamanConfiguration.url + 'api/incidents/getFirst');
    }

    function saveIncident(incident) {

      return $http({
        method : 'POST',
        url : shamanConfiguration.url +
        'api/incidents/saveincident',
        data: $.param(incident)
      });

    }

    var service = {
      incident                     : {},
      getAll                       : getAll,
      getByPhone                   : getByPhone,
      validateLocality             : validateLocality,
      getNewIncidentNumberToCreate : getNewIncidentNumberToCreate,
      setIncident                  : setIncident,
      getIncidentById              : getIncidentById,
      getLast                      : getLast,
      getPrevious                  : getPrevious,
      getNext                      : getNext,
      getFirst                     : getFirst,
      saveIncident                 : saveIncident
    };

    return service;

  }

})();
