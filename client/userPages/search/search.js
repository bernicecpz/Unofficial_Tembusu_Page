Template.search.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'events', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
});

Template.search.helpers({
  searching() {
    return Template.instance().searching.get();
    console.log("Is still loading & searching");
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  events() {
    let events = Events.find();
    if ( events ) {
      return events;
    }
  },
  report: function(){
    console.log("Is still loading");
  }
});

Template.search.events({
  'keyup [name="search"]' ( event, template ) {
      event.preventDefault();
    let value = event.target.value.trim();

    if ( value !== '' && event.keyCode === 13 ) {
      template.searchQuery.set( value );
      template.searching.set( true );
    }

    if ( value === '' ) {
      template.searchQuery.set( value );
    }
  }
});
