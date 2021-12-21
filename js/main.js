require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Home",
    "esri/widgets/Search",
    "esri/widgets/Locate",
    "esri/layers/FeatureLayer",
    "esri/widgets/Directions",
    "esri/config",
    "esri/widgets/Expand",
    "esri/widgets/Daylight",
    "esri/widgets/Search/SearchSource",
    "esri/geometry/geometryEngine",
    "esri/geometry/Point",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/rest/route",
    "esri/rest/support/RouteParameters",
    "esri/rest/support/FeatureSet",
    "esri/widgets/Legend"
  ], (
    Map, SceneView, BasemapGallery, Home, Search, Locate, FeatureLayer, Directions, esriConfig, Expand, Daylight, SearchSource, geometryEngine,
    Point, GraphicsLayer, Graphic, route, RouteParameters, FeatureSet, Legend ) => {

    //Visualization
    //Const for visualization
    const more200 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#C42795",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    const from100to200 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#287EA0",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    const from50to100 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#319CB4",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    const from25to50 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#3CBAC8",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    const from10to25 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#93EDD4",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    const less10 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#F3F5C4",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    //Visualization renderer
    const renderer = {
      type: "class-breaks", // autocasts as new ClassBreaksRenderer()
      field: "STAT_01_VISO_2015",
      legendOptions: {
        title: "Gyventojų skaičius"
      },
      defaultSymbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "black",
        style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: [50, 50, 50, 0.6]
        }
      },
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 10000,
          symbol: less10,
          label: "< 10.000"
        },
        {
          minValue: 10000,
          maxValue: 25000,
          symbol: from10to25,
          label: "10.000 - 25.000"
        },
        {
          minValue: 25000,
          maxValue: 50000,
          symbol: from25to50,
          label: "25.000 - 50.000"
        },
        
        {
          minValue: 50000,
          maxValue: 100000,
          symbol: from50to100,
          label: "50.000 - 100.000"
        },
        {
          minValue: 100000,
          maxValue: 200000,
          symbol: from100to200,
          label: "100.000 - 200.000"
        },
        {
          minValue: 200000,
          maxValue: 3000000,
          symbol: more200,
          label: "> 200.000"
        }
      ]
    };

    const lithuaniaLayer = new FeatureLayer({
      url: "https://services.arcgis.com/fFwZ4t9mPyCe14FA/ArcGIS/rest/services/HBContent_GVNTJAI_SAV/FeatureServer/0",
      title: "Gyventojų skaičius (savivaldybės) 2015",
      renderer: renderer,
      popupTemplate: {
        title: "Savivaldybė: {SAV_PAV}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "STAT_01_VISO_2015",
                label: "Viso"
              },
              {
                fieldName: "STAT_01_VYR_2015",
                label: "Vyrų"
              },
              {
                fieldName: "STAT_01_MOT_2015",
                label: "Moterų"
              }
            ]
          }
        ],
        overwriteActions: true
      },
      // show only block groups in Seattle
      opacity: 0.5
    });

    //API Key for Directions widget
    esriConfig.apiKey =
      "AAPK718c2b8abe3e4bf3bb4a66d9a184c6famT6pLElvjyXEAoq2ezpNfVr5x-SI9CQQoJo-0mbkSxalT_vG3qLq-UVK_KIgPSOk";

    const routeUrl =
      "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    const routeLayer = new GraphicsLayer();

    const map = new Map({
      basemap: "topo-vector",
      ground: "world-elevation",
      layers: [routeLayer, lithuaniaLayer]
    });

    const view = new SceneView({
      container: "viewDiv",
      map: map,
      // scale: 99900,
      // center: [25.279652, 54.687157],
      camera: {
        position: [25.366764, 54.098056, 99900],
        tilt: 30
      },
      qualityProfile: "high",
      environment: {
        atmosphere: {
          // creates a realistic view of the atmosphere
          quality: "high"
        },
        lighting: {
          // gets the current date at the user's location
          // and converts it to the local date in Vilnius, Lithuania
          date: new Date(),
          directShadowsEnabled: true
        }
      },
      ui: {
        components: ["attribution"]
      }
    });

    //basemap
    const basemapGallery = new BasemapGallery({
      view: view,
      container: document.createElement("div")
    });

    //basemap expand
    const bgExpand = new Expand({
      view: view,
      content: basemapGallery
    });
    // close the expand whenever a basemap is selected
    basemapGallery.watch("activeBasemap", () => {
      const mobileSize =
        view.heightBreakpoint === "xsmall" ||
        view.widthBreakpoint === "xsmall";

      if (mobileSize) {
        bgExpand.collapse();
      }
    });

    view.ui.add(bgExpand, "top-right");

    //home button
    const homeBtn = new Home({
      view: view
    });

    view.ui.add(homeBtn, "top-left");

    //District search
    const featureLayerDistricts = new FeatureLayer({
      url: "https://services5.arcgis.com/1eJSoE398Vejvs53/ArcGIS/rest/services/Apygardos_2020_07_03/FeatureServer/0",
      popupTemplate: {
        title: "{apg_nr} | {F20apg_pav} apygarda",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "apg_nr",
                label: "District Number"
              },
              {
                fieldName: "F20apg_pav",
                label: "District Name"
              }
            ]
          }
        ],
        overwriteActions: true
      }
    });

    const searchWidget = new Search({
      view: view,
      allPlaceholder: "District search",
      includeDefaultSources: false,
      sources: [
        {
          layer: featureLayerDistricts,
          searchFields: ["apg_nr"],
          displayField: "apg_nr",
          exactMatch: false,
          outFields: ["apg_nr", "F20apg_pav"],
          name: "LT District",
          placeholder: "example: 47"
        },
        {
          name: "ArcGIS World Geocoding Service",
          placeholder: "example: Nuuk, GRL",
          apiKey:
            "AAPK718c2b8abe3e4bf3bb4a66d9a184c6famT6pLElvjyXEAoq2ezpNfVr5x-SI9CQQoJo-0mbkSxalT_vG3qLq-UVK_KIgPSOk",
          singleLineFieldName: "SingleLine",
          locator:
            "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        }
      ]
    });

    view.ui.add(searchWidget, {
      position: "bottom-left"
    });

    //locate button
    const locateBtn = new Locate({
      view: view
    });

    view.ui.add(locateBtn, {
      position: "top-left"
    });

    //directions
    let directionsWidget = new Directions({
      view: view
    });

    //directions expand
    const dirExpand = new Expand({
      view: view,
      content: directionsWidget
    });
    // close the expand whenever a basemap is selected
    directionsWidget.watch("activeDirections", () => {
      const mobileSize =
        view.heightBreakpoint === "xsmall" ||
        view.widthBreakpoint === "xsmall";

      if (mobileSize) {
        directionsWidget.collapse();
      }
    });

    view.ui.add(dirExpand, "top-right");

    //daylight
    const daylightWidget = new Daylight({
      view: view,
      // plays the animation twice as fast than the default one
      playSpeedMultiplier: 2,
      // disable the timezone selection button
      visibleElements: {
        timezone: false
      }
    });

    const btnDaylight = document.getElementById("buttonDaylight");

    view.ui.add(btnDaylight, "top-left");
    // view.ui.add(daylightWidget, "top-left");

    let widgetIsVisible = true;
    btnDaylight.addEventListener("click", () => {
      if (widgetIsVisible) {
        view.ui.remove(daylightWidget);
        widgetIsVisible = false;
      } else {
        view.ui.add(daylightWidget, "top-left");
        widgetIsVisible = true;
      }
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Graphics
    // point
    const point = {
      type: "point",
      x: 25.279652,
      y: 54.687157,
      z: 1010
    };

    const markerSymbol = {
      type: "simple-marker",
      color: [255, 255, 255],
      outline: {
        color: [245, 90, 66],
        width: 2
      }
    };

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol
    });

    graphicsLayer.add(pointGraphic);

    //lines

    const polyline = {
      type: "polyline",
      paths: [
        [25.279652, 54.687157, 200],
        [25.279652, 54.687157, 1000]
      ]
    };

    const polyline2 = {
      type: "polyline",
      paths: [
        [25.299652, 54.697157, 200],
        [25.279652, 54.687157, 1000]
      ]
    };

    const polyline3 = {
      type: "polyline",
      paths: [
        [25.299652, 54.677157, 200],
        [25.279652, 54.687157, 1000]
      ]
    };

    const polyline4 = {
      type: "polyline",
      paths: [
        [25.259652, 54.677157, 200],
        [25.279652, 54.687157, 1000]
      ]
    };

    const polyline5 = {
      type: "polyline",
      paths: [
        [25.259652, 54.697157, 200],
        [25.279652, 54.687157, 1000]
      ]
    };

    const lineSymbol = {
      type: "simple-line",
      color: [245, 138, 66],
      width: 4
    };

    const polylineGraphic = new Graphic({
      geometry: polyline,
      symbol: lineSymbol
    });

    const polylineGraphic2 = new Graphic({
      geometry: polyline2,
      symbol: lineSymbol
    });

    const polylineGraphic3 = new Graphic({
      geometry: polyline3,
      symbol: lineSymbol
    });

    const polylineGraphic4 = new Graphic({
      geometry: polyline4,
      symbol: lineSymbol
    });

    const polylineGraphic5 = new Graphic({
      geometry: polyline5,
      symbol: lineSymbol
    });

    graphicsLayer.add(polylineGraphic);
    graphicsLayer.add(polylineGraphic2);
    graphicsLayer.add(polylineGraphic3);
    graphicsLayer.add(polylineGraphic4);
    graphicsLayer.add(polylineGraphic5);

    //Polygons

    const polygon = {
      type: "polygon",
      rings: [
        [25.299652, 54.697157, 200],
        [25.299652, 54.677157, 200],
        [25.259652, 54.677157, 200],
        [25.259652, 54.697157, 200],
        [25.299652, 54.697157, 200]
      ]
    };

    const polygon2 = {
      type: "polygon",
      rings: [
        [25.299652, 54.677157, 200],
        [25.259652, 54.677157, 200],
        [25.279652, 54.687157, 1000],
        [25.299652, 54.677157, 200]
      ]
    };

    const polygon3 = {
      type: "polygon",
      rings: [
        [25.259652, 54.697157, 200],
        [25.299652, 54.697157, 200],
        [25.279652, 54.687157, 1000],
        [25.259652, 54.697157, 200]
      ]
    };

    const fillSymbol = {
      type: "simple-fill",
      color: [227, 139, 79, 0.8],
      outline: {
        color: [227, 139, 79],
        width: 1
      }
    };

    const fillSymbol2 = {
      type: "simple-fill",
      color: [102, 252, 3, 0.5],
      outline: {
        color: [227, 139, 79],
        width: 2
      }
    };

    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol
    });

    const polygonGraphic2 = new Graphic({
      geometry: polygon2,
      symbol: fillSymbol2
    });

    const polygonGraphic3 = new Graphic({
      geometry: polygon3,
      symbol: fillSymbol2
    });

    graphicsLayer.add(polygonGraphic);
    graphicsLayer.add(polygonGraphic2);
    graphicsLayer.add(polygonGraphic3);

    //Analysis - Route
    const routeParams = new RouteParameters({
      apiKey:
        "AAPK718c2b8abe3e4bf3bb4a66d9a184c6famT6pLElvjyXEAoq2ezpNfVr5x-SI9CQQoJo-0mbkSxalT_vG3qLq-UVK_KIgPSOk",
      stops: new FeatureSet(),
      outSpatialReference: {
        // autocasts as new SpatialReference()
        wkid: 3857
      }
    });

    const stopSymbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      style: "cross",
      size: 15,
      outline: {
        // autocasts as new SimpleLineSymbol()
        width: 4
      }
    };

    const routeSymbol = {
      type: "simple-line", // autocasts as SimpleLineSymbol()
      color: [0, 0, 255, 0.5],
      width: 5
    };

    view.on("click", addStop);

    function addStop(event) {
      // Add a point at the location of the map click
      const stop = new Graphic({
        geometry: event.mapPoint,
        symbol: stopSymbol
      });
      routeLayer.add(stop);

      // Execute the route if 2 or more stops are input
      routeParams.stops.features.push(stop);
      if (routeParams.stops.features.length >= 2) {
        route.solve(routeUrl, routeParams).then(showRoute);
      }
    }

    function showRoute(data) {
      const routeResult = data.routeResults[0].route;
      routeResult.symbol = routeSymbol;
      routeLayer.add(routeResult);
    }

    //Legend - Visualization
    const legend = new Legend({
      view: view
    });

    //Population legend expand
    const legendExpand = new Expand({
      view: view,
      content: legend
    });
    // close the expand whenever a basemap is selected
    legend.watch("activeBasemap", () => {
      const mobileSize =
        view.heightBreakpoint === "xsmall" ||
        view.widthBreakpoint === "xsmall";

      if (mobileSize) {
        legend.collapse();
      }
    });

    view.ui.add(legendExpand, "top-left");

    //     // //featurelayer
    // const featureLayer = new FeatureLayer({
    //   url: "https://services.arcgis.com/fFwZ4t9mPyCe14FA/arcgis/rest/services/HBContent_GVNTJAI_SAV/FeatureServer",
    //   opacity: 0.2
    // });
    
    //Camera control 
    // Register events to control
    const rotateAntiClockwiseSpan = document.getElementById(
      "rotateAntiClockwiseSpan"
    );
    const rotateClockwiseSpan = document.getElementById(
      "rotateClockwiseSpan"
    );
    const indicatorSpan = document.getElementById("indicatorSpan");
    rotateClockwiseSpan.addEventListener("click", () => {
      rotateView(-1);
    });
    rotateAntiClockwiseSpan.addEventListener("click", () => {
      rotateView(1);
    });
    indicatorSpan.addEventListener("click", tiltView);

    // Watch the change on view.camera
    view.watch("camera", updateIndicator);

    // Create the event's callback functions
    function rotateView(direction) {
      let heading = view.camera.heading;

      // Set the heading of the view to the closest multiple of 90 degrees,
      // depending on the direction of rotation
      if (direction > 0) {
        heading = Math.floor((heading + 1e-3) / 90) * 90 + 90;
      } else {
        heading = Math.ceil((heading - 1e-3) / 90) * 90 - 90;
      }

      view
        .goTo({
          heading: heading
        })
        .catch((error) => {
          if (error.name != "AbortError") {
            console.error(error);
          }
        });
    }

    function tiltView() {
      // Get the camera tilt and add a small number for numerical inaccuracies
      let tilt = view.camera.tilt + 1e-3;

      // Switch between 3 levels of tilt
      if (tilt >= 80) {
        tilt = 0;
      } else if (tilt >= 40) {
        tilt = 80;
      } else {
        tilt = 40;
      }

      view
        .goTo({
          tilt: tilt
        })
        .catch((error) => {
          if (error.name != "AbortError") {
            console.error(error);
          }
        });
    }

    function updateIndicator(camera) {
      let tilt = camera.tilt;
      let heading = camera.heading;

      // Update the indicator to reflect the current tilt/heading using
      // css transforms.

      const transform = `rotateX(${
        0.8 * tilt
      }deg) rotateY(0) rotateZ(${-heading}deg)`;
      indicatorSpan.style["transform"] = transform;
      indicatorSpan.style["-webkit-transform"] = transform; // Solution for Safari
    }
  });