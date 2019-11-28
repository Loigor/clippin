/* tslint:disable */


/**
 * AUTO-GENERATED FILE @ 2019-11-28 17:18:19 - DO NOT EDIT!
 *
 * This file was automatically generated by schemats v.3.0.3
 * $ schemats generate -c postgres://username:password@postgres/postgres -t sample -t pack -t flyway_schema_history -t pack_has_sample -t sample_has_tag -t tag -s public
 *
 */


export namespace sampleFields {
    export type id = number;
    export type md5 = string | null;
    export type filename = string | null;
    export type metadata = Object | null;
    export type bpm = number | null;
    export type location = Object | null;
    export type created_at = Date | null;

}

export interface sample {
    id: sampleFields.id;
    md5: sampleFields.md5;
    filename: sampleFields.filename;
    metadata: sampleFields.metadata;
    bpm: sampleFields.bpm;
    location: sampleFields.location;
    created_at: sampleFields.created_at;

}

export namespace packFields {
    export type id = number;
    export type name = string | null;
    export type created_at = Date | null;

}

export interface pack {
    id: packFields.id;
    name: packFields.name;
    created_at: packFields.created_at;

}

export namespace flyway_schema_historyFields {
    export type installed_rank = number;
    export type version = string | null;
    export type description = string;
    export type type = string;
    export type script = string;
    export type checksum = number | null;
    export type installed_by = string;
    export type installed_on = Date;
    export type execution_time = number;
    export type success = boolean;

}

export interface flyway_schema_history {
    installed_rank: flyway_schema_historyFields.installed_rank;
    version: flyway_schema_historyFields.version;
    description: flyway_schema_historyFields.description;
    type: flyway_schema_historyFields.type;
    script: flyway_schema_historyFields.script;
    checksum: flyway_schema_historyFields.checksum;
    installed_by: flyway_schema_historyFields.installed_by;
    installed_on: flyway_schema_historyFields.installed_on;
    execution_time: flyway_schema_historyFields.execution_time;
    success: flyway_schema_historyFields.success;

}

export namespace pack_has_sampleFields {
    export type pack_id = number;
    export type sample_id = number;

}

export interface pack_has_sample {
    pack_id: pack_has_sampleFields.pack_id;
    sample_id: pack_has_sampleFields.sample_id;

}

export namespace sample_has_tagFields {
    export type sample_id = number;
    export type tag_id = number;

}

export interface sample_has_tag {
    sample_id: sample_has_tagFields.sample_id;
    tag_id: sample_has_tagFields.tag_id;

}

export namespace tagFields {
    export type id = number;
    export type name = string | null;
    export type description = string | null;

}

export interface tag {
    id: tagFields.id;
    name: tagFields.name;
    description: tagFields.description;

}
