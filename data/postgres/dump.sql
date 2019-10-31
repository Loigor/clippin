--
-- PostgreSQL database dump
--

-- Dumped from database version 12.0 (Debian 12.0-2.pgdg100+1)
-- Dumped by pg_dump version 12.0 (Debian 12.0-2.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sample; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sample (
    id integer NOT NULL,
    md5 character varying(32),
    filename character varying,
    metadata jsonb,
    bpm real,
    location jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sample OWNER TO postgres;

--
-- Name: sample_has_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sample_has_tag (
    sample_id bigint NOT NULL,
    tag_id bigint NOT NULL
);


ALTER TABLE public.sample_has_tag OWNER TO postgres;

--
-- Name: sample_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sample_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sample_id_seq OWNER TO postgres;

--
-- Name: sample_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sample_id_seq OWNED BY public.sample.id;


--
-- Name: samplepack; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.samplepack (
    id integer NOT NULL,
    name character varying,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.samplepack OWNER TO postgres;

--
-- Name: samplepack_has_sample; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.samplepack_has_sample (
    pack_id bigint NOT NULL,
    sample_id bigint NOT NULL
);


ALTER TABLE public.samplepack_has_sample OWNER TO postgres;

--
-- Name: samplepack_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.samplepack_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.samplepack_id_seq OWNER TO postgres;

--
-- Name: samplepack_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.samplepack_id_seq OWNED BY public.samplepack.id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    name character varying,
    description character varying
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_id_seq OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- Name: sample id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample ALTER COLUMN id SET DEFAULT nextval('public.sample_id_seq'::regclass);


--
-- Name: samplepack id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.samplepack ALTER COLUMN id SET DEFAULT nextval('public.samplepack_id_seq'::regclass);


--
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- Data for Name: sample; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sample (id, md5, filename, metadata, bpm, location, created_at) FROM stdin;
\.


--
-- Data for Name: sample_has_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sample_has_tag (sample_id, tag_id) FROM stdin;
\.


--
-- Data for Name: samplepack; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.samplepack (id, name, created_at) FROM stdin;
\.


--
-- Data for Name: samplepack_has_sample; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.samplepack_has_sample (pack_id, sample_id) FROM stdin;
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag (id, name, description) FROM stdin;
\.


--
-- Name: sample_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sample_id_seq', 1, false);


--
-- Name: samplepack_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.samplepack_id_seq', 1, false);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_id_seq', 1, false);


--
-- Name: sample_has_tag sample_has_tag_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_has_tag
    ADD CONSTRAINT sample_has_tag_pk PRIMARY KEY (sample_id, tag_id);


--
-- Name: sample sample_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample
    ADD CONSTRAINT sample_pk PRIMARY KEY (id);


--
-- Name: samplepack_has_sample samplepack_has_sample_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.samplepack_has_sample
    ADD CONSTRAINT samplepack_has_sample_pk PRIMARY KEY (pack_id, sample_id);


--
-- Name: samplepack samplepack_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.samplepack
    ADD CONSTRAINT samplepack_pk PRIMARY KEY (id);


--
-- Name: tag tag_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pk PRIMARY KEY (id);


--
-- Name: sample_has_tag sample_has_tag_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_has_tag
    ADD CONSTRAINT sample_has_tag_fk FOREIGN KEY (sample_id) REFERENCES public.sample(id);


--
-- Name: sample_has_tag sample_has_tag_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_has_tag
    ADD CONSTRAINT sample_has_tag_fk_1 FOREIGN KEY (tag_id) REFERENCES public.tag(id);


--
-- Name: samplepack_has_sample samplepack_has_sample_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.samplepack_has_sample
    ADD CONSTRAINT samplepack_has_sample_fk FOREIGN KEY (sample_id) REFERENCES public.sample(id);


--
-- Name: samplepack_has_sample samplepack_has_sample_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.samplepack_has_sample
    ADD CONSTRAINT samplepack_has_sample_fk_1 FOREIGN KEY (pack_id) REFERENCES public.samplepack(id);


--
-- PostgreSQL database dump complete
--

