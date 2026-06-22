ALTER TABLE duplicatas ADD COLUMN id_semestre INT REFERENCES semestres(id_semestre);
ALTER TABLE duplicatas ADD COLUMN session VARCHAR(20);
ALTER TABLE derogations ADD COLUMN id_semestre INT REFERENCES semestres(id_semestre);
ALTER TABLE derogations ADD COLUMN session VARCHAR(20);
