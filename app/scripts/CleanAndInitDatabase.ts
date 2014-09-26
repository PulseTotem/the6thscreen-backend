/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./core/Logger.ts" />

/// <reference path="./model/ModelItf.ts" />
/// <reference path="./model/SDI.ts" />
/// <reference path="./model/Zone.ts" />
/// <reference path="./model/Call.ts" />
/// <reference path="./model/CallType.ts" />
/// <reference path="./model/Profil.ts" />
/// <reference path="./model/Timeline.ts" />
/// <reference path="./model/InfoType.ts" />
/// <reference path="./model/ParamValue.ts" />
/// <reference path="./model/ParamType.ts" />
/// <reference path="./model/ReceivePolicy.ts" />
/// <reference path="./model/Renderer.ts"/>
/// <reference path="./model/RenderPolicy.ts" />
/// <reference path="./model/Role.ts" />
/// <reference path="./model/Source.ts" />
/// <reference path="./model/User.ts" />

/**
 * Class to clean and Initialise Database with some data.
 *
 * @class CleanAndInitDatabase
 */
class CleanAndInitDatabase {

    static toClean : Array<any> = [Profil,SDI];

    /**
     * Method to clean and fulfill database with some data.
     *
     * @method run
     */
    run() {
        this.cleanAll();
        this.fulfill();
    }

    /**
     * Method to clean the database.
     *
     * @method cleanAll
     */
    cleanAll() {
        for(var i = 0; i < CleanAndInitDatabase.toClean.length; i++) {
            var modelToClean = CleanAndInitDatabase.toClean[i];
	        Logger.debug("Iterating on models to clean");
	        Logger.debug(modelToClean);
            var instances = modelToClean.all();
            for(var j in instances) {
                var toDelete = instances[j];
                toDelete.delete();
            }
        }
    }

	createSources() : void {
		var picture_album = new InfoType("PictureAlbum");
		picture_album.create();

		var recherche_flickr = new Source("RechercheFlickR","FlickR","Recherche à partir de l'API FlickR","localhost",4000);
		recherche_flickr.create();

		var param_recherche_flickr = new ParamType("Recherche","Champs de recherche pour FlickR","String","None");
		param_recherche_flickr.create();

		var limit_recherche_flickr = new ParamType("Limite","Limiter le nombre de résultats","Entier","Positif");
		limit_recherche_flickr.create();

		recherche_flickr.addParamType(param_recherche_flickr);
		recherche_flickr.setInfoType(picture_album);
		recherche_flickr.addParamType(limit_recherche_flickr);

        /*
        var feed_node = new InfoType("FeedNode");
        feed_node.create();

        var feed_content = new InfoType("FeedContent");
        feed_content.create();

        var rss_feed_reader = new Source("RSSFeedReader", "RSSFeedReader", "Récupération d'un flux RSS", "localhost", 4000);
        rss_feed_reader.create();

        var limit_rss_feed_reader = new ParamType("Limite","Limiter le nombre de résultats","Entier","Positif");
        limit_rss_feed_reader.create();

        rss_feed_reader.addParamType(limit_rss_feed_reader);
        rss_feed_reader.setInfoType(feed_content);*/
	}

    /**
     * Method to fulfill database with some data.
     *
     * @method fulfill
     */
    fulfill() {
	    this.createSources();

        /*var feed_node = new InfoType("FeedNode");
        feed_node.create();*/

        var feed_content = new InfoType("FeedContent");
        feed_content.create();

        var rss_feed_reader = new Source("RSSFeedReader", "RSSFeedReader", "Récupération d'un flux RSS", "localhost", 4000);
        rss_feed_reader.create();

        var url_rss_feed_reader = new ParamType("FeedURL","Lien du flux RSS","String","URL");
        url_rss_feed_reader.create();

        var limit_rss_feed_reader = new ParamType("Limite","Limiter le nombre de résultats","Entier","Positif");
        limit_rss_feed_reader.create();

        rss_feed_reader.addParamType(url_rss_feed_reader);
        rss_feed_reader.addParamType(limit_rss_feed_reader);
        rss_feed_reader.setInfoType(feed_content);

	    var s : SDI = new SDI("SDItruc", "*");
	    s.create();

	    var u : User = new User("toto");
	    u.create();

	    Logger.debug("Associate user");
	    s.addUser(u);
	    // to check if doublons are created
	    u.addSDI(s);

	    s.loadAssociations(); // ???
	    Logger.debug(s);

        var z : Zone = new Zone("MainZone", "Zone principale de SDItruc", "0");
        z.create();

        s.addZone(z);

        var ct : CallType = new CallType();
        ct.create();

        ct.setSource(rss_feed_reader);

        var renderer : Renderer = new Renderer("FeedContentRendererGeneric", "Renderer générique pour les infos de type FeedContent.");
        renderer.create();

        renderer.setInfoType(feed_content);

        ct.setRenderer(renderer);

        //Receive : La politique de réception => ???
        var rp : ReceivePolicy = new ReceivePolicy("Last");
        rp.create();

        ct.setReceivePolicy(rp);

        //Render : La politique d'affichage => ???
        var renderP : RenderPolicy = new RenderPolicy("Ordered");
        renderP.create();

        ct.setRenderPolicy(renderP);

        z.addCallType(ct);

        var p : Profil = new Profil("ProfilSDItruc1", "Profil n°1 de SDItruc");
        p.create();

        s.addProfil(p);

        var c : Call = new Call("FilUNS");
        c.create();

        c.setCallType(ct);

        var feedUrl_pv : ParamValue = new ParamValue("http://filuns.unice.fr/accueil/atom.xml");
        feedUrl_pv.create();
        feedUrl_pv.setParamType(url_rss_feed_reader);

        var limit_pv : ParamValue = new ParamValue("10");
        limit_pv.create();
        limit_pv.setParamType(limit_rss_feed_reader);

        c.addParamValue(feedUrl_pv);
        c.addParamValue(limit_pv);

        p.addCall(c);

        //Enlever le lien call -> source
        //Enlever le lien call -> zone

        //

        /*
        var p : Profil = new Profil("profil1", "description de profil1");
        p.create();

        p.setName("profil 5");

        p.update();

        var p2 : Profil = Profil.read(2);
        p2.delete();
        */

        Logger.debug(SDI.all());
    }
}

var caid = new CleanAndInitDatabase();
caid.run();