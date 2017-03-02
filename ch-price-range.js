'use strict';

angular.module('ch-price-range', ['ngMaterial']).directive("chPriceRange", function($mdPanel, $mdMedia) {
	return {
        restrict: "E",
        scope: {
        	min: "=?",
    		max: "=?",
    		title: "@",
    		subtitle: "@",
    		wrapperClass: "@",
    		buttonClass: "@",
    		type: "@",
    		disableParentScroll: "=?",
    		hasBackdrop: "=?",
    		hasConfirm: "=?",
	    	hasClose: "=?"
        },
        template: 
        	'<ng-form name="chPriceRangeForm" class="flex no-padding layout-column">' +
		  		'<md-button class="ch-price-range-button flex minimal-button text-initial {{buttonClass}}" aria-label="Change price range">' +
		  			'<div class="{{wrapperClass}}">' +
		  				'<div ng-show="max" class="text-wrap row-mini">' +
							'<strong ng-show="min">{{min|chCurrency}}&nbsp;-&nbsp;</strong>' + 
							'<span ng-show="!min"><span translate="common.up.to"></span>&nbsp;</span>' +
							'<strong>{{max|chCurrency}}</strong>&nbsp;<span ng-if="type == \'nightly\'" class="text-lowercase" translate="service.type.payment.NIGHTLY"></span>' +
						'</div>' +
						'<div ng-show="!max">' +
							'<span translate="filter.by"></span>&nbsp;<span class="text-lowercase" translate="common.price"></span>' +
						'</div>' +
		  			'</div>' +
		  		'</md-button>' +
		  	'</ng-form>',
	  	replace: true,
        link: function (scope, element, attrs) {
        	scope.type = _.includes(["nightly", "normal"], _.toLower(scope.type)) ? _.toLower(scope.type) : "normal";
        	scope.hasBackdrop = _.isNil(scope.hasBackdrop) ? false : scope.hasBackdrop;
        	
        	var targetEl = element[0].querySelector(".ch-price-range-button");
        	
        	var position = $mdPanel.newPanelPosition()
		        .relativeTo(targetEl)
		        .addPanelPosition($mdPanel.xPosition.CENTER, $mdPanel.yPosition.BELOW);
	    			    	
	    	var config = {
    			attachTo: angular.element(document.body),
			    controller: "priceSliderCtrl",
			    controllerAs: "ctrl",
			    templateUrl: "/price-slider.html",
			    position: position,
			    clickOutsideToClose: true,
			    disableParentScroll: scope.disableParentScroll,
			    hasBackdrop: !$mdMedia('gt-sm') || scope.hasBackdrop,
			    fullscreen: !$mdMedia('gt-sm'),
			    panelClass: "panel-medium bg-white md-whiteframe-15dp",
			    trapFocus: true,
			    onCloseSuccess: function(panelRef, closeReason) {
			    	if (_.isBoolean(closeReason) && closeReason) {
			    		scope.updateOriginal();
			    	}
			    }
	    	 };
	    	
	    	 var openPanel = function(ev) {
	    		 scope.data = {
    				min: scope.min,
    				max: scope.max
	    		 };
	    		 
	    		 var locals = {
    				hasConfirm: _.isBoolean(scope.hasConfirm) ? scope.hasConfirm : true,
					title: scope.title,
					subtitle: scope.subtitle,
					data: scope.data
	    		 };
 	    		  	    		 
	    		 config.openFrom = ev;
	    		 config.hasBackdrop = !$mdMedia('gt-sm') || scope.hasBackdrop;
	    		 config.fullscreen = !$mdMedia('gt-sm');
	    		 config.locals = locals;
	    		 
	    		 // apro il pannello 
	    		 $mdPanel.open(config);
	    	 };
	    	 
	    	 targetEl.addEventListener('click', openPanel);
	    	 
	    	 scope.updateOriginal = function() {
	    		 if (!scope.data) {
	    			 return;
	    		 }
	    		 
	    		 scope.min = scope.data.min;
	    		 scope.max = scope.data.max;
	    	 };
	    		        	
	    	 scope.$on("$destroy", function() {
	    		 targetEl.removeEventListener("click", openPanel);
	    	 });
        }
	};
}).run(function($templateCache) {
  $templateCache.put('price-slider.html', '<div layout="column" layout-padding> <div class="text-center"> <strong> <span ng-if="!ctrl.title" translate="common.price.range"></span> <span ng-if="ctrl.title" ng-bind-html="ctrl.title"></span> </strong> <div class="text-center text-gray-light"> <small ng-if="!ctrl.subtitle" translate="hotel.filter.by.price"></small> <small ng-if="ctrl.subtitle" ng-bind-html="ctrl.subtitle"></small> </div> </div> <div> <rzslider class="bg-primary" rz-slider-model="ctrl.data.min" rz-slider-high="ctrl.data.max" rz-slider-options="sliderOptions"></rzslider> </div> <div layout ng-if="ctrl.hasConfirm" class="no-padding"> <div flex></div> <md-button class="no-margin-top no-margin-bottom" ng-click="ctrl.cancel()" aria-label="Cancel"> <small translate="common.cancel"></small> </md-button> <md-button class="md-primary no-margin-top no-margin-bottom" ng-click="ctrl.confirm()" aria-label="Confirm"> <small translate="common.confirm"></small> </md-button> </div> <div layout ng-if="!ctrl.hasConfirm && ctrl.hasClose" class="no-padding"> <div flex></div> <md-button class="md-primary no-margin-top no-margin-bottom" ng-click="ctrl.confirm()" aria-label="Close"> <small translate="common.close"></small> </md-button> </div> </div>');
});;
