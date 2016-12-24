(function(){
  'use strict';
   angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems);

  NarrowItDownController.$inject = ['MenuSearchService'];

  function FoundItems() {
    var ddo = {
      templateUrl: 'menuItems.html',
      scope: {
        menuitems: '<',
        onRemove: '&'
     },
      controller: FoundItemsDirectiveController,
      controllerAs: 'foundItemsMenu',
      bindToController: true
    };
    return ddo;
  }

  function FoundItemsDirectiveController() {
    var foundItemsMenu = this;
  }

  function NarrowItDownController(MenuSearchService) {
    var menuController = this;

    menuController.getMatchedMenu = function() {
      try {
        menuController.menuItems = MenuSearchService.getMenuItems(menuController.searchText);                
      } catch (e) {
        console.log(e.message);
      }
    };

    menuController.removeItem = function(itemIndex) {
      // console.log("In remove");
      menuController.menuItems.splice(itemIndex,1);
    };
  }

  MenuSearchService.$inject = ['$http'];

  function MenuSearchService($http) {
    var menuService = this;


    menuService.getMenuItems = function(searchText) {
      var foundMatchedMenuItems = [];

      var menuItems = $http({
        method : "GET",
        url : "https://davids-restaurant.herokuapp.com/menu_items.json"
      });
      // console.log("in promise");
      menuItems.then(function(response) {
        var rawData = response.data;
        var menu = rawData.menu_items;
        // console.log(menu);
        for(var i = 0; i < menu.length; i++){
          var description = menu[i].description.toLowerCase();
            if(description.search(searchText.toLowerCase()) !== -1) {
              foundMatchedMenuItems.push(menu[i]);
            }
        }
      })
      .catch(function(error) {
        console.log(error);
      });

      return foundMatchedMenuItems;
    };
  }
})();
