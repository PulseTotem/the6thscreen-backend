/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/stats/StatObject.ts" />
/// <reference path="./BackendConfig.ts" />

/**
 * Allow to interact with Stats module
 *
 * @class StatsClient
 */
class StatsClient {

    /**
     * Used to push a statistic. This method only takes a StatObject as parameter.
     * It logs if the stat is well push or not.
     * @param stat : the stat object to push
     */
    static pushStats(stat : StatObject) : void {

        var url : string = BackendConfig.getStatsURL()+"create";
        var json = stat.toJSON();

        RestClient.post(url, json, function () {
            Logger.debug("Stat pushed.");
        }, function (err) {
            Logger.error("Error while pushing a stat.");
            Logger.debug(err);
        });
    }
}