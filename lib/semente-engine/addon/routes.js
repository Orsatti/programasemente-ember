import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function () {
  this.route('index', {path: '/'});
  this.route('profile', function() {
    this.route('review', { path: '/review/:pessoa_id' });
    this.route('index', { path: '/:pessoa_id'});
    this.route('certificados', { path: '/certificados/:pessoa_id'});
    this.route('calendario', { path: '/calendario/:pessoa_id'});
  });
  this.route('aulas', function() {
    this.route('content', { path: '/content/:aula_id' });
    this.route('bibliotecaindex', { path: '/bibliotecaindex' });
    this.route('certificado', { path: '/certificado/:platano_id'});
    this.route('index', { path: '/'});
    this.route('createaula', { path: '/createaula/:platano_id'});
    this.route('editaula', { path: '/editaula/:aula_id'});
  });
  this.route('geracompanhamento');
  this.route('acompanhamento', function() {
    this.route('plataforma', {path: '/plataforma/:instituicao_id' });
    this.route('ead', { path: '/ead/:instituicao_id' });
    this.route('persondetails', {path: '/persondetails/:pessoa_id'});
  });
  this.route('conteudos', function() {
    this.route('create', { path: '/create/' });
    this.route('edit', { path: '/edit/:conteudo_id' });
    this.route('index', { path: '/'});
  });
  this.route('marketing', function() {
    this.route('index', { path: '/'});
    this.route('areas', function() {
      this.route('create', { path: '/create/:pasta_id' });
      this.route('filter', { path: '/filter/' });
      this.route('edit', { path: '/edit/:marketing_id' });
      this.route('index', { path: '/:pasta_id'});
    });
  });
  this.route('modulos', function () {
    this.route('modlist', { path: '/modlist/:modulo_id'});
    this.route('modetails', { path: '/modetails/:modulo_id'}, function () {
      this.route('ativdetails', { path: '/:atividade_id'}, function () {
        this.route('secdetails', { path: '/:secao_id'});
        this.route('transitions', { path: '/transitions/:secao_id'});
      });
    });
    this.route('certificado', { path: '/certificado/:modulo_id'});
  });
  this.route('biblioteca');
  this.route('administracao', function () {
    this.route('admdata', { path: '/admdata'});
    this.route('persondetails', { path: '/persondetails/:pessoa_id'});
    this.route('moddata', function () {});
  });
  this.route('gersistema', function () {
    this.route('createinst');
  });
  this.route('gerdata', function() {
    this.route('informations', { path: "/informations/:instituicao_id" }, function() {
      this.route('deleteinst', { path: "/deleteinst/:instituicao_id" })
    });
    this.route('users', { path: "/users/:instituicao_id" }, function(){
      this.route('createuser', { path: "/createuser/:instituicao_id" })
      this.route('edituser', { path: "/edituser/:pessoa_id" })
      this.route('deleteuser', { path: "/deleteuser/:pessoa_id" })
      this.route('loteuser', { path: "/loteuser/:instituicao_id" })
    });
    this.route('classes', { path: "/classes/:instituicao_id" })
    this.route('years', { path: "/years/:instituicao_id" })
    this.route('codes', { path: "/codes/:instituicao_id" })
    this.route('pilares', { path: "/pilares/:instituicao_id" })
  });
  this.route('uploader');
  this.route('styleguide');
});
